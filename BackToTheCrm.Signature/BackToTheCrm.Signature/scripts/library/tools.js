if (typeof (BackToTheCrm) == "undefined") {
    BackToTheCrm = { __namespace: true };
}

BackToTheCrm.Tools = (function () {

    var getURLParameter = function (name) {
        /// <summary>
        /// Get a parameter set in the URL
        /// </summary>
        /// <param name="name">Name of the parameter to get</param>
        /// <returns type="String">Value of the parameter, null if the parameter didn't exist</returns>
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
    };

    var isEmptyGuid = function (guid) {
        /// <summary>
        /// Check if the guid is empty 
        /// </summary>
        /// <param name="guid" type="String">Guid to check</param>
        /// <returns type="Boolean">True if the guid is empty else False</returns>
        var emptyGuid = "00000000-0000-0000-0000-000000000000";
        return (!guid || emptyGuid === guid.replace(/[}{]/g, ""));
    };

    var getParentId = function (defaultId) {
        /// <summary>
        /// Retrieve the Id of the entity from the form.
        /// Use this function from a embedded HTML webresource
        /// </summary>
        /// <param name="defaultId" type="String">Default id if no id has been found</param>
        /// <returns type="String">Id retrieved</returns>
        var id = null;
        if (!isEmptyGuid(getURLParameter("id"))) {
            id = getURLParameter("id");
        }
        else {
            try {
                id = window.parent.Xrm.Page.data.entity.getId();
            }  catch (e) {}
        }
        if (!id && !!defaultId) {
            id = defaultId;
        }
        return id;
    };

    return {
        "getURLParameter": getURLParameter,
        "isEmptyGuid": isEmptyGuid,
        "getParentId": getParentId
    };
})();