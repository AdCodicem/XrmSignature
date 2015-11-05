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

    return {
        "getURLParameter": getURLParameter
    };
})();