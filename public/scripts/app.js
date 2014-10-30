(function () {
    var unifiedPushClient,
        variantId = "82fecfba-068f-4b38-909e-824cb7a7f933",
        variantSecret = "188bf10e-15e1-4223-8cef-6c058a084f63",
        unifiedPushUrl = "https://safari-lholmqui.rhcloud.com/ag-push/";



    // Taken from https://developer.apple.com/library/mac/documentation/NetworkingInternet/Conceptual/NotificationProgrammingGuideForWebsites/PushNotifications/PushNotifications.html#//apple_ref/doc/uid/TP40013225-CH3-SW8

    document.body.onload = function() {
        unifiedPushClient = AeroGear.UnifiedPushClient(variantId, variantSecret, unifiedPushUrl);
        // Ensure that the user can receive Safari Push Notifications.
        if ('safari' in window && 'pushNotification' in window.safari) {
            var permissionData = window.safari.pushNotification.permission('web.org.lholmquist.blog');
            checkRemotePermission(permissionData);
        }
    };

    var checkRemotePermission = function (permissionData) {
        if (permissionData.permission === 'default') {
            // This is a new web service URL and its validity is unknown.
            window.safari.pushNotification.requestPermission(
                'https://safaripush-lholmqui.rhcloud.com', // The web service URL.
                'web.org.lholmquist.blog',     // The Website Push ID.
                {}, // Data that you choose to send to your server to help you identify the user.
                checkRemotePermission         // The callback function.
            );
        }
        else if (permissionData.permission === 'denied') {
            // The user said no.
            console.log('denied');
        }
        else if (permissionData.permission === 'granted') {
            var metadata = {
                deviceToken: permissionData.deviceToken
            };

            var settings = {};

            settings.metadata = metadata;
            // The web service URL is a valid push provider, and the user said yes.
            // permissionData.deviceToken is now available to use.
            unifiedPushClient.registerWithPushServer(settings);
        }
    };

})();
