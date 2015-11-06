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
                "init": init,
                "messages": {
                    en: {
                        title: "Signature",
                        description: "Sign above",
                        clear: "Clear",
                        save: "Save",
                        saveSignatureAlert: "Please sign before clicking Save.",
                        saveCreateAlert: "The record must be created before saving the signature.",
                        paramError: "The parameters contains error. Please contact your administrator.",
                        saveError: "An error has occured while saving."
                    }
                }
            }
        }
    });

    // Get user locale
    var lcidLocaleMapping = {
        "1025": "ar",
        "1026": "bg",
        "1027": "ca",
        "1028": "zh",
        "1029": "cs",
        "1030": "da",
        "1031": "de",
        "1032": "el",
        "1033": "en",
        "1034": "es",
        "1035": "fi",
        "1036": "fr",
        "1037": "he",
        "1038": "hu",
        "1039": "is",
        "1040": "it",
        "1041": "ja",
        "1042": "ko",
        "1043": "nl",
        "1044": "nb",
        "1045": "pl",
        "1046": "pt",
        "1047": "rm",
        "1048": "ro",
        "1049": "ru",
        "1050": "hr",
        "1051": "sk",
        "1052": "sq",
        "1053": "sv",
        "1054": "th",
        "1055": "tr",
        "1056": "ur",
        "1057": "id",
        "1058": "uk",
        "1059": "be",
        "1060": "sl",
        "1061": "et",
        "1062": "lv",
        "1063": "lt",
        "1064": "tg",
        "1065": "fa",
        "1066": "vi",
        "1067": "hy",
        "1068": "az",
        "1069": "eu",
        "1070": "sb",
        "1071": "mk",
        "1073": "ts",
        "1074": "tn",
        "1076": "xh",
        "1077": "zu",
        "1078": "af",
        "1079": "ka",
        "1080": "fo",
        "1081": "hi",
        "1082": "mt",
        "1084": "gd",
        "1085": "yi",
        "1086": "ms",
        "1087": "kk",
        "1089": "sw",
        "1090": "tk",
        "1091": "uz",
        "1092": "tt",
        "1093": "bn",
        "1094": "pa",
        "1095": "gu",
        "1096": "or",
        "1097": "ta",
        "1098": "te",
        "1099": "kn",
        "1100": "ml",
        "1101": "as",
        "1102": "mr",
        "1103": "sa",
        "1104": "mn",
        "1105": "bo",
        "1106": "cy",
        "1107": "km",
        "1108": "lo",
        "1109": "my",
        "1110": "gl",
        "1113": "sd",
        "1115": "si",
        "1118": "am",
        "1120": "ks",
        "1121": "ne",
        "1125": "dv",
        "1140": "gn",
        "1142": "la",
        "1143": "so",
        "1153": "mi",
        "2049": "ar",
        "2052": "zh",
        "2055": "de",
        "2057": "en",
        "2058": "es",
        "2060": "fr",
        "2064": "it",
        "2067": "nl",
        "2068": "nn",
        "2070": "pt",
        "2072": "ro",
        "2073": "ru",
        "2074": "sr",
        "2077": "sv",
        "2092": "az",
        "2108": "gd",
        "2110": "ms",
        "2115": "uz",
        "2117": "bn",
        "2128": "mn",
        "3073": "ar",
        "3076": "zh",
        "3079": "de",
        "3081": "en",
        "3084": "fr",
        "3098": "sr",
        "4097": "ar",
        "4100": "zh",
        "4103": "de",
        "4105": "en",
        "4106": "es",
        "4108": "fr",
        "5121": "ar",
        "5124": "zh",
        "5127": "de",
        "5129": "en",
        "5130": "es",
        "5132": "fr",
        "5146": "bs",
        "6145": "ar",
        "6153": "en",
        "6154": "es",
        "6156": "fr",
        "7169": "ar",
        "7177": "en",
        "7178": "es",
        "7180": "fr",
        "8193": "ar",
        "8201": "en",
        "8202": "es",
        "9217": "ar",
        "9225": "en",
        "9226": "es",
        "9228": "fr",
        "10241": "ar",
        "10249": "en",
        "10250": "es",
        "10252": "fr",
        "11265": "ar",
        "11273": "en",
        "11274": "es",
        "11276": "fr",
        "12289": "ar",
        "12297": "en",
        "12298": "es",
        "12300": "fr",
        "13313": "ar",
        "13321": "en",
        "13322": "es",
        "13324": "fr",
        "14337": "ar",
        "14346": "es",
        "14348": "fr",
        "15361": "ar",
        "15370": "es",
        "16385": "ar",
        "16393": "en",
        "16394": "es",
        "17418": "es",
        "18442": "es",
        "19466": "es",
        "20490": "es"
    };

    var userLcid = BackToTheCrm.Tools.getURLParameter("UserLCID");
    var locale = lcidLocaleMapping[userLcid];

    var parameters = {},
        signaturePad = null,
        annotationId = null,
        signatureImage = null;

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
                Xrm.Utility.alertDialog(BackToTheCrm.Signature.messages[locale].saveError);
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
        $.ajaxSetup({
            cache: true
        });

        if (!!userLcid) {
            $.getScript("scripts/signature." + locale + ".js", initCallback)
                .fail(function () {
                    locale = "en";
                    initCallback();
                });
        }
    }

    var initCallback = function () {
        /// <summary>
        /// Callback initializing the signature component after the localization has been loaded
        /// </summary>
        var $clearButton = $("[data-action=clear]"),
            $saveButton = $("[data-action=save]"),
            $descriptionDiv = $(".description"),
            canvas = $("canvas").get(0);

        $descriptionDiv.text(BackToTheCrm.Signature.messages[locale].description);
        $clearButton.text(BackToTheCrm.Signature.messages[locale].clear);
        $saveButton.text(BackToTheCrm.Signature.messages[locale].save);

        try {
            // Get the parameters
            parameters = {
                id: BackToTheCrm.Tools.getParentId(),
                entityLogicalName: BackToTheCrm.Tools.getURLParameter("typename"),
                annotation: JSON.parse(BackToTheCrm.Tools.getURLParameter("data"))
            };
        } catch (e) {
            console.log(e);
            Xrm.Utility.alertDialog(BackToTheCrm.Signature.messages[locale].paramError);
        }

        // Bind the buttons' events
        $clearButton
            .button({
                icons: {
                    primary: "crm-icon-delete"
                }
            })
            .click(function (event) {
                signaturePad.clear();
            });

        $saveButton
            .button({
                icons: {
                    primary: "crm-icon-save"
                }
            })
            .click(function (event) {
                if (parameters.annotation.isMandatory === true && signaturePad.isEmpty()) {
                    Xrm.Utility.alertDialog(BackToTheCrm.Signature.messages[locale].saveSignatureAlert);
                } else {
                    if (BackToTheCrm.Tools.isEmptyGuid(BackToTheCrm.Tools.getParentId(parameters.id))) {
                        Xrm.Utility.alertDialog(BackToTheCrm.Signature.messages[locale].saveCreateAlert);
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
                    Xrm.Utility.alertDialog(BackToTheCrm.Signature.messages[locale].saveSignatureAlert);
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
            minWidth: 1,
            maxWidth: 3
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