/// <reference path="library/tools.js" />
/// <reference path="library/jquery.js" />
/// <reference path="library/jquery_ui.js" />
/// <reference path="library/json2.js" />
/// <reference path="library/XrmServiceToolkit.js" />
/// <reference path="library/signature_pad.js" />
(function ($) {
    /// <summary>
    /// Signature for MSCRM
    /// Author : Clément MARTY
    /// Date : 2015-11-06
    /// 
    /// Include : 
    /// - JSON2 :                   https://github.com/douglascrockford/JSON-js
    /// - jQuery v1.11.1 :          https://jquery.com/
    /// - jQuery UI v1.11.0 :       https://jqueryui.com/
    /// - Signature Pad v1.5.1 :    https://github.com/szimek/signature_pad
    /// - XrmServiceToolkit v2.0.1: https://xrmservicetoolkit.codeplex.com/
    /// </summary>
    $.extend(true, window, {
        "BackToTheCrm": {
            "Signature": {
                "init": init
            }
        }
    });

    var parameters = {},
        signaturePad = null,
        annotationId = null,
        signatureImage = null,
        messages = {};

    var getSignature = function () {
        /// <summary>
        /// Get the saved signature and display it
        /// </summary>
        var entityId = BackToTheCrm.Tools.getParentId(parameters.id);
        var fetchXml = [
            '<entity name="annotation">',
                '<attribute name="annotationid" />',
                '<attribute name="mimetype" />',
                '<attribute name="documentbody" />',
                '<filter type="and">',
                    '<condition attribute="filename" operator="eq" value="' + parameters.annotation.filename + '" />',
                    '<condition attribute="subject" operator="eq" value="' + (parameters.annotation.subject || parameters.annotation.filename) + '" />',
                    '<condition attribute="objectid" operator="eq" value="' + entityId + '" />',
                '</filter>',
            '</entity>'
        ].join("");
        var results = XrmServiceToolkit.Soap.Fetch(fetchXml, true);
        if (results.length > 0) {
            annotationId = results[0].id;
            if (results[0].attributes.documentbody && results[0].attributes.mimetype) {
                signaturePad.fromDataURL("data:" + results[0].attributes.mimetype.value + ";base64," + results[0].attributes.documentbody.value);
                signatureImage = results[0].attributes.documentbody.value;
            }
        }
    };

    var save = function () {
        /// <summary>
        /// Save the signature in PNG format within an annotation
        /// </summary>
        /// <returns type="Boolean">True if saved successfully, else False</returns>
        if (parameters) {
            var entityId = BackToTheCrm.Tools.getParentId(parameters.id);
            try {
                // Get the signature in PNG format base64 encoded
                var dataURI = signaturePad.toDataURL();
                dataURI = dataURI.split(",");
                var regex = /^data:(.*);base64$/i;
                var mime = dataURI[0].match(regex);
                mime = mime[1];

                if (signatureImage === dataURI[1]) {
                    // Skip the saving of unmodified image
                    return true;
                }
                else {
                    signatureImage = dataURI[1];
                }

                if (signaturePad.isEmpty() && !!annotationId) {
                    // Delete annotation if signature cleared
                    XrmServiceToolkit.Soap.Delete("annotation", annotationId);
                    annotationId = null;
                    return true;
                }

                // Create or Update the annotation
                var annotation;
                if (!!annotationId) {
                    annotation = new XrmServiceToolkit.Soap.BusinessEntity("annotation", annotationId);
                }
                else {
                    annotation = new XrmServiceToolkit.Soap.BusinessEntity("annotation");
                }
                annotation.attributes["objectid"] = {
                    type: "EntityReference",
                    logicalName: parameters.entityLogicalName,
                    id: entityId
                };
                annotation.attributes["subject"] = (parameters.annotation.subject || parameters.annotation.filename);
                annotation.attributes["filename"] = parameters.annotation.filename;
                annotation.attributes["mimetype"] = mime;
                annotation.attributes["documentbody"] = signatureImage;
                if (!!annotationId) {
                    XrmServiceToolkit.Soap.Update(annotation);
                }
                else {
                    annotationId = XrmServiceToolkit.Soap.Create(annotation);
                }

                if (!!window.opener) {
                    window.close();
                }
            } catch (e) {
                Xrm.Utility.alertDialog(messages.saveError);
                console.log(e);
                return false;
            }
        }
        return true;
    };

    function init() {
        /// <summary>
        /// Initialize the signature component and load the localization
        /// </summary>
        BackToTheCrm.Tools.Localization.loadMessages("signature", initCallback);
    }

    var initCallback = function () {
        /// <summary>
        /// Callback initializing the signature component after the localization has been loaded
        /// </summary>
        var $clearButton = $("[data-action=clear]"),
            $saveButton = $("[data-action=save]"),
            $descriptionDiv = $(".description"),
            canvas = $("canvas").get(0);

        messages = BackToTheCrm.Signature.messages[BackToTheCrm.Tools.Localization.getUserLocale()]

        $descriptionDiv.text(messages.description);
        $clearButton.find(".ui-button-text").text(messages.clear);
        $saveButton.find(".ui-button-text").text(messages.save);

        try {
            // Get the parameters
            parameters = {
                id: BackToTheCrm.Tools.getParentId(),
                entityLogicalName: BackToTheCrm.Tools.getURLParameter("typename"),
                annotation: JSON.parse(BackToTheCrm.Tools.getURLParameter("data"))
            };
        } catch (e) {
            console.log(e);
            Xrm.Utility.alertDialog(messages.paramError);
        }

        // Bind the buttons' events
        $clearButton
            .click(function (event) {
                signaturePad.clear();
            });

        $saveButton
            .click(function (event) {
                if (parameters.annotation.isMandatory === true && signaturePad.isEmpty()) {
                    Xrm.Utility.alertDialog(messages.saveSignatureAlert);
                } else {
                    if (BackToTheCrm.Tools.isEmptyGuid(BackToTheCrm.Tools.getParentId(parameters.id))) {
                        Xrm.Utility.alertDialog(messages.saveCreateAlert);
                    }
                    else {
                        save();
                    }
                }
            });

        // Add an event to save before closing
        if (parameters.annotation.autosave !== false) {
            $(window).bind("beforeunload", function () {
                if (parameters.annotation.isMandatory === true && signaturePad.isEmpty()) {
                    Xrm.Utility.alertDialog(messages.saveSignatureAlert);
                }
                else if (!BackToTheCrm.Tools.isEmptyGuid(BackToTheCrm.Tools.getParentId(parameters.id))) {
                    save();
                }
            });
        }

        // Pen options
        var options = {
            penColor: "black",
            backgroundColor: "rgba(255,255,255,0)",
            minWidth: 0.5,
            maxWidth: 2.5
        };

        var resizeCanvas = function () {
            /// <summary>
            /// Adjust canvas coordinate space taking into account pixel ratio,
            /// to make it look crisp on mobile devices.
            /// This also causes canvas to be cleared.
            /// </summary>
            var ratio = window.devicePixelRatio || 1;
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContext("2d").scale(ratio, ratio);
        };

        $(window).resize(resizeCanvas);
        resizeCanvas();

        signaturePad = new SignaturePad(canvas, options);
        if (!BackToTheCrm.Tools.isEmptyGuid(parameters.id)) {
            getSignature();
        }
    };
})(jQuery);