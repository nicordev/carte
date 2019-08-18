/**
 * 	CookieHandler.js
 *
 * 	Class to handle cookies
 */

function CookieHandler() {

    return {

        /**
         * Create a cookie
         * 
         * @param {string} cookieName 
         * @param {string} cookieValue 
         * @param {integer} duration duration in milliseconds or in days
         * @param {boolean} durationInDays set to true if the duration is given in days
         */
        setCookie: function (cookieName, cookieValue, duration, durationInDays = true) {

            let expirationDate = new Date(),
                expires = "expires=";

            if (durationInDays) {
                duration = duration * 24 * 60 * 60 * 1000;
            }

            expirationDate.setTime(expirationDate.getTime() + duration);
            expires += expirationDate.toUTCString();
            document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
        },

        /**
         * Get the value of a cookie
         * 
         * @param {string} cookieName 
         */
        getCookie: function (cookieName) {

            let name = cookieName + "=",
                decodedCookie = decodeURIComponent(document.cookie),
                cookies = decodedCookie.split(';');

            for (let i = 0, cookie; i < cookies.length; i++) {
                cookie = cookies[i];

                while (cookie.charAt(0) == ' ') {
                    cookie = cookie.substring(1);
                }

                if (cookie.indexOf(name) == 0) {

                    return cookie.substring(name.length, cookie.length);
                }
            }

            return null;
        },

        /**
         * Delete a cookie
         * 
         * @param {string} cookieName 
         */
        deleteCookie: function (cookieName) {

            setCookie(cookieName, "", -999);
        }
    };
}