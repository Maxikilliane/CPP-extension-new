/*jshint esversion: 6 */

window.browser = (function() {
  return window.msBrowser || window.browser || chrome;
})();

var categoriesToExplanaitionMap = new Map();
categoriesToExplanaitionMap.set("Introductory/Generic", "This paragraph introduces the policy, a section, or a group of practices, but does not mention a specific privacy/data practice. The paragraph makes generic statements, but does not describe specific privacy/data practices.");
categoriesToExplanaitionMap.set("First Party Collection/Use", "This paragraph describes data collection or data use by the company/organization owning the website or mobile app.");
categoriesToExplanaitionMap.set("Does_Does Not", "This attribute denotes if the paragraph explicitly states that something is done, or is not done.");
categoriesToExplanaitionMap.set("Collection Mode", "This attribute denotes if the data collection performed by the first party is implicit (e.g., company collects information without user's explicit awareness) or explicit (e.g., user provides information). Defaults to “not selected.”");
categoriesToExplanaitionMap.set("Action First-Party", "This attribute describes how the first party collects, tracks, or obtains user information.");
categoriesToExplanaitionMap.set("Identifiability", "This attribute describes, if it is explicitly stated whether the information or data practice is linked to the user's identity or if it is anonymous.");
categoriesToExplanaitionMap.set("Personal Information Type", "This attribute describes, what category of information is collected or tracked by the company/organization.");
categoriesToExplanaitionMap.set("Purpose", "This attribute describes the purpose of collecting or using user information.");
categoriesToExplanaitionMap.set("User Type", "This attribute states, if this practice applies specifically to users with an account or users without an account.");
categoriesToExplanaitionMap.set("Choice Type", "This attribute describes if user choices are explicitly offered for this practice.");
categoriesToExplanaitionMap.set("Choice Scope", "This attribute indicates the scope of user choices. In some cases, even if user choices are not clear or specific, this attribute can be selected.");
categoriesToExplanaitionMap.set("Third Party Sharing/Collection", "This paragraph is about data sharing with third parties or data collection by third parties. A third party is a company/organization other than the first party company/organization that owns the website.");
categoriesToExplanaitionMap.set("Action Third Party", "This attribute describes how the third-party receives, collects, tracks, or sees user information.");
categoriesToExplanaitionMap.set("User Choice/Control", "This attribute describes general choices and control options available to users.");
categoriesToExplanaitionMap.set("User Access, Edit and Deletion", "This paragraph describes practices that allows users to access, edit or delete the data that the company/organization has about them.");
categoriesToExplanaitionMap.set("Access Type", "This attribute describes options offered for users to access, edit, delete information that the company/organization has about them.");
categoriesToExplanaitionMap.set("Access Scope", "This attribute states, if access is offered, what data does it apply to.");
categoriesToExplanaitionMap.set("Data Retention", "This category specifyies the retention period for collected user information.");
categoriesToExplanaitionMap.set("Retention Purpose", "This attribute states the purpose to which the retention practice applies (may be “unspecified”).");
categoriesToExplanaitionMap.set("Data Security", "This category describes how users’ information is secured and protected, e.g., from confidentiality, integrity, or availability breaches. Common practices include the encryption of stored data and online communications.");
categoriesToExplanaitionMap.set("Security Measure", "This attribute describes the type of security that the website/app implements to protect users’ information.");
categoriesToExplanaitionMap.set("Policy Change", "This category describes the company/organization’s practices concerning if and how users will be informed of changes to its privacy policy, including any choices offered to users.");
categoriesToExplanaitionMap.set("Change Type", "This attribute states about what type of changes to the website/app’s policy users are notified.");
categoriesToExplanaitionMap.set("Notification Type", "This attribute states whether the user is notified when the privacy policy changes.");
categoriesToExplanaitionMap.set("User Choice", "This attribute states the choices/options offered to the user when the policy changes.");
categoriesToExplanaitionMap.set("Do Not Track", "This category explains if and how Do Not Track signals (DNT) for online tracking and advertising are honored.");
categoriesToExplanaitionMap.set("Do Not Track policy", "This attribute describes if and how Do-Not-Track signals (DNT) are honored.");
categoriesToExplanaitionMap.set("International and Specific Audiences", "This category describes specific audiences mentioned in the company/organization’s privacy policy, such as children or international users, for which the company/organization may provide special provisions.");
categoriesToExplanaitionMap.set("Other", "This category describes another aspect not covered in the other categories is discussed in the text segment.");
categoriesToExplanaitionMap.set("Other Type", "This attribute describes what other aspect that is not covered in the other categories is discussed in the text segment.");
categoriesToExplanaitionMap.set("Practice not covered", "The paragraph describes a specific data practice, which is not covered by any of the other data practice categories.");
categoriesToExplanaitionMap.set("Privacy contact information", "This attribute descirbes how to contact the company with questions, concerns, or complaints about the privacy policy.");
categoriesToExplanaitionMap.set("Other", "This attribute applies, when the paragraph does not fit any of the other values.");
categoriesToExplanaitionMap.set("Audience Type", "This attribute descirbes which audience the policy segment refers to.");
categoriesToExplanaitionMap.set("User with account", "This site seems to allow you to log in or create an account. Below are statements from this page's privacy policy that refer specifically to users with an account or users who are registered with the website.");
categoriesToExplanaitionMap.set("Financial", "This site seems to handle financial data These are data practices that refer to financial information, like credit/debit card data, other payment information, credit scores, and so on.");
categoriesToExplanaitionMap.set("Location", "This site seems to have access to your location. Below are statements from this page's privacy policy that refer to geo-location information (e.g., your current location) regardless of granularity, i.e., it could be the exact location, the ZIP code, or the city.");
categoriesToExplanaitionMap.set("Advertising", "This site seems to display advertising. Below are statements from this page's privacy policy that revolve around showing (targeted) advertisements to you.");
categoriesToExplanaitionMap.set("Cookies and tracking elements", "This site seems to be using cookies and/or tracking elements. Below are statements from this page's privacy policy that refer to identifiers which are locally stored on your device by the company/organization or third-parties. These can be cookies, beacons, or similar technology that is commonly used to uniquely identify users, but which is not essential to establish a connection with your device or to provide a service.");
categoriesToExplanaitionMap.set("Social media data", "This site seems to be using social media. Below are statements from this page's privacy policy which talk about the exchange of your data with social media sites.");

HtmlSanitizer.AllowedTags.img = true;
HtmlSanitizer.AllowedTags.input = true;
HtmlSanitizer.AllowedTags.textarea = true;
HtmlSanitizer.AllowedTags.button = true;
HtmlSanitizer.AllowedCssStyles.display = true;
HtmlSanitizer.AllowedAttributes.id = true;
HtmlSanitizer.AllowedAttributes.class = true;
HtmlSanitizer.AllowedAttributes.name = true;
HtmlSanitizer.AllowedAttributes.type = true;
HtmlSanitizer.AllowedAttributes.value = true;
HtmlSanitizer.AllowedAttributes.rows = true;
HtmlSanitizer.AllowedAttributes.cols = true;

var whitespaceCharacters = [' ', '  ',
  '\b', '\t', '\n', '\v', '\f', '\r', `\"`, `\'`, `\\`,
  '\u0008', '\u0009', '\u000A', '\u000B', '\u000C',
  '\u000D', '\u0020', '\u0022', '\u0027', '\u005C',
  '\u00A0', '\u2028', '\u2029', '\uFEFF'
];

var ssome = (predicate, list) => {
  const len = list.length;
  for (let i = 0; i < len; i++) {
    if (predicate(list[i]) === true) {
      return true;
    }
  }
  return false;
};

var hasWhitespace = char => ssome(
  w => char.indexOf(w) > -1,
  whitespaceCharacters
);

window.addEventListener('DOMContentLoaded', () => {
  var promise = new Promise(function(resolve, reject) {
    window.browser.runtime.sendMessage({
        message: "getAnnotation",
        url: window.location.host
      },
      function(response) {
        resolve(response);
      });
  });
  promise.then(function(result) {
    window.browser.runtime.sendMessage({
      message: "resetQuestionnaireStatus"
    }, function(response) {
    });
    if (result.data !== undefined) {
      var delayInMilliseconds = 3000;
      console.log("loading annotation from database...", result.data);
      setTimeout(function() {
        getContexts(result.data);
        window.browser.runtime.sendMessage({
          message: "bubbles",
          data: bubbles
        }, function(response) {});
      }, delayInMilliseconds);
    } else {
      console.log("generating new annotation...", result.data);
      var privacyUrls = ["datenschutz", "privacy", "datenschutzerklaerung", "privacy-policy", "privacypolicy", "legal", "#privacy"];
      var urls = [...document.links].map(l => l.href);
      urlsAsAElement = [];
      urls.forEach(function(url) {
        var a = document.createElement('a');
        a.href = url;
        urlsAsAElement.push(a);
      });
      var finalPrivacyURL = "";
      var allUrls = urlsAsAElement.filter(pageUrl => privacyUrls.find(urlKeyword => pageUrl.pathname.includes(urlKeyword)));
      if (allUrls.length == 0) {
        allUrls = urlsAsAElement.filter(pageUrl => privacyUrls.find(urlKeyword => pageUrl.href.includes(urlKeyword)));
      }

      if (allUrls.length != 0) {
        if (allUrls[0].baseURI.includes("google")) {
          finalPrivacyURL = "https://www.gstatic.com/policies/privacy/pdf/20200331/acec359e/google_privacy_policy_en_eu.pdf";
        }
        if (allUrls[0].baseURI.includes("zillow")) {
          finalPrivacyURL = "https://www.zillowgroup.com/zg-privacy-policy/";
        }
        if (allUrls[0].baseURI.includes("apple")) {
          finalPrivacyURL = "https://www.apple.com/legal/privacy/en-ww/";
        }
        if (allUrls[0].baseURI.includes("chase")) {
          finalPrivacyURL = "https://www.chase.com/digital/resources/privacy-security/privacy/online-privacy-policy";
        }
        if (allUrls[0].baseURI.includes("yahoo")) {
          finalPrivacyURL = "https://www.verizonmedia.com/policies/ie/de/verizonmedia/privacy/index.html";
        }
        if (allUrls[0].baseURI.includes("bankrate")) {
          finalPrivacyURL = "https://www.bankrate.com/privacy/";
        }
        if (allUrls[0].baseURI.includes("slack")) {
          finalPrivacyURL = "https://slack.com/intl/en-de/trust/privacy/privacy-policy?geocode=en-de";
        }
        if (allUrls[0].baseURI.includes("linkedin")) {
          finalPrivacyURL = "https://www.linkedin.com/legal/privacy-policy";
        }
        if (allUrls[0].baseURI.includes("azure")) {
          finalPrivacyURL = "https://privacy.microsoft.com/en-us/privacystatement";
        }
        if (allUrls[0].baseURI.includes("woot")) {
          finalPrivacyURL = "https://www.woot.com/privacy?ref=w_ngf_pp";
        }
      } else {
        if (urls.length != 0) {
          if (urls[0].includes("wikipedia")) {
            finalPrivacyURL = "https://meta.wikimedia.org/wiki/Privacy_policy";
          }
          if (urls[0].includes("bing") || urls[0].includes("microsoft") || urls[0].includes("msn") || urls[0].includes("azure")) {
            finalPrivacyURL = "https://privacy.microsoft.com/en-us/privacystatement";
          }
          if (urls[0].includes("twitch")) {
            finalPrivacyURL = "https://www.twitch.tv/p/legal/privacy-notice/";
          }
          if (urls[0].includes("nytimes")) {
            finalPrivacyURL = "https://www.nytimes.com/subscription/privacy-policy#/privacy";
          }
          if (urls[1].includes("aliexpress")) {
            finalPrivacyURL = "https://helppage.aliexpress.com/buyercenter/questionAnswer.htm?isRouter=0&viewKey=1&id=1000099018&categoryIds=9205401";
          }
          if (urls[0].includes("linkedin")) {
            finalPrivacyURL = "https://www.linkedin.com/legal/privacy-policy";
          }
          if (urls[0].includes("tiktok")) {
            finalPrivacyURL = "https://www.tiktok.com/legal/privacy-policy?lang=en";
          }
          if (urls[0].includes("bankrate")) {
            finalPrivacyURL = "https://www.bankrate.com/privacy/";
          }
        }
        if (window.location.host == "twitter.com") {
          finalPrivacyURL = "https://twitter.com/en/privacy";
        }


      }
      var promises = [];
      if (allUrls.length == 0) {
        window.browser.runtime.sendMessage({
          message: "showError"
        }, function(response) {});
      }

      allUrls.forEach(function(url) {
        promises.push(getScoreForUrl(url));
      });

      Promise.all(promises).then((results) => {
        var maxVal = -1;
        var ppPage = results[0];
        results.forEach((result) => {
          if (result.count > maxVal) {
            maxVal = result.count;
            ppPage = result;
          }
        });
        if (ppPage !== undefined) {
          var detectingLanguages = window.browser.i18n.detectLanguage(ppPage.ppText, function(result) {
            if (result.languages[0].language == "en") {
              var promiseSegments;
              if (finalPrivacyURL != "") {
                promiseSegments = getSegments(finalPrivacyURL);
              } else {
                promiseSegments = getSegments(ppPage.url);
              }
              promiseSegments.then(function(url) {
                querySegmentationResult(url);
              });
            } else {
              window.browser.runtime.sendMessage({
                message: "showError"
              }, function(response) {});
            }
          });
        } else {
          var promiseSegments;
          if (finalPrivacyURL != "") {
            promiseSegments = getSegments(finalPrivacyURL);
          }
          promiseSegments.then(function(url) {
            querySegmentationResult(url);
          });
        }
      });
      return true;
    }

  });
  return true;
});



function querySegmentationResult(url) {
  return new Promise((resolve, reject) => {
    $.getJSON(url, function(data) {
      if (data.data) {
        var merged = [].concat.apply([], data.data);
        var promise = getPPAnalysis(merged);
        promise.then(function(url) {
          queryResult(url);
        }, function(err) {});
      } else {
        setTimeout(function() {
          querySegmentationResult(url);
        }, 1000);
      }
    }, data => {
      resolve(data);
    });
  });
}

function queryResult(url) {
  $.getJSON(url, function(data) {
    if (data.data) {
      window.browser.runtime.sendMessage({
        message: "saveAnnotation",
        baseUrl: window.location.host,
        data: data
      }, function(response) {});
      getContexts(data);
    } else {
      setTimeout(function() {
        queryResult(url);
      }, 1000);
    }
  });
}

function getContexts(result) {
  window.browser.runtime.sendMessage({
    message: "showSuccess"
  }, function(response) {});
  showPPInfoForAdLinks(result);
  showPPInfoForBuyingStuff(result);
  showPPInfoForAccount(result);
  showPPInfoForSocialMedia(result);
  getElementByText(["a", "p"], ["Cookies", "cookies"], "Cookies and tracking elements", result);
  getElementByText(["span", "a"], ["Sign in", "Log in", "Log In", "Sign In", "Sign Up", "LOG IN"], "User with account", result);
  getElementByText(["a"], ["Log in", "Log In", "Sign In", "Sign up", "Sign Up", "Sign in", "log in"], "User with account", result);
  getElementByText(["span"], ["Pricing"], "Financial", result);
  getElementById(["ads", "Ads"], "Advertising", result);
  getElementById(["user"], "User with account", result);
  getElementById(["cart", "carts", "checkout", "payment"], "Financial", result);
  getElementById(["address", "location", "loc", "ip", "geolocation"], "Location", result);
  // getElementByClassName(["address", "location", "loc", "geolocation"], "Location", result);
  getElementByClassName(["twitter", "facebook", "pinterest", "linkedin", "instagram"], "Social media data", result);
    removeRedundantBubbles();
}

let bubbles = [];
let previousPredicate;

var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {

    (rv[x.getAttribute(key)] = rv[x.getAttribute(key)] || []).push(x);
    return rv;
  }, {});
};

function removeRedundantBubbles() {
  bubbles = groupBy(bubbles, "category");
  for (const [key, value] of Object.entries(bubbles)) {
    if (bubbles[key].length > 2) {
      for (let i = 2; i < bubbles[key].length; i++) {
        bubbles[key][i].style.display = "none";
      }
    }
  }
}


function showPPInfo(parentElem, result, predicate, isMainCategory) {
  if ((window.location.host == "stackoverflow.com") && (parentElem.tagName == "IFRAME")) {
    console.log('do nothing');
  }
  console.log(predicate)
  if (previousPredicate == predicate && window.location.host.includes("amazon.com") && predicate !== "User with account" && predicate !== "Advertising") {
  console.log('do nothing');
  }
  else {
    previousPredicate = predicate;
    var closestBox = $(parentElem).parent().find('.cppBox').get();

    var id = ("" + Math.random()).substring(2);
    var textId = "text" + id;

    var cpp = document.createElement("div");
    cpp.classList.add("cppBox");
    cpp.setAttribute("category", predicate);
    var logo = document.createElement("img");
    var logoString = "";
    if (predicate == "Analytics/Research") {
      logoString = "Analytics";
    } else {
      logoString = predicate;
    }
    logo.src = browser.runtime.getURL(`icons/${logoString}_Logo.png`);
    logo.classList.add("cppLogo");
    var logoId = id + "header";
    logo.setAttribute("id", logoId);
    cpp.appendChild(logo);

    var sentences = extractInfoToDisplay(result, predicate, isMainCategory);

    sentences = sentences.filter(function(element) {
      return element.length > 30;
    });

    if (sentences.length != 0 && $(parentElem).is(':visible') && !$(parentElem).hasClass("cpp-explanation")) {

      var textField = createTextField(predicate, sentences, textId);

      // situation in which it is collected
      document.body.appendChild(textField);
      // cpp.appendChild(textField);

      cpp.classList.add("cppBox");
      cpp.setAttribute("id", id);
      bubbles.push(cpp);
      parentElem.insertAdjacentElement("beforebegin", cpp);

      if (closestBox[0] != undefined) {
        var rect1 = closestBox[0].getBoundingClientRect();
        var rect2 = cpp.getBoundingClientRect();
        var overlap = !(rect1.right <= rect2.left ||
          rect1.left >= rect2.right ||
          rect1.bottom <= rect2.top ||
          rect1.top >= rect2.bottom);
        if (overlap) {
          if (cpp.getAttribute("category") === closestBox[0].getAttribute("category")) {
            console.log("removed", cpp)
            cpp.style.display = "none";
            bubbles = bubbles.filter(function(item) {
              return item !== cpp;
            });
          } else {
            cpp.style.marginLeft = "45px";
          }
        }


      }

      jQuery(`#${id}`).hover(function(e) {
        e.stopImmediatePropagation();
      });

      jQuery(`#${id}`).click(function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        toggleTextBox(textId);
        // jQuery(`#text${id}`).slideToggle(0);
        if (!parentElem.classList.contains("highlight-cpp")) {
          document.body.style.marginRight = null;
          document.body.style.setProperty('margin-right', '30%', 'important');
          //document.body.style.marginRight = "30%";
          if (document.getElementsByTagName("header")[0] !== undefined) {
            document.getElementsByTagName("header")[0].style.width = "70%";
          }
          parentElem.classList.add("highlight-cpp");
        } else {

          var boxes = document.getElementsByClassName("overlay-cpp");
          for (var box of boxes) {
            box.style.display = "0%";
            document.body.style.marginRight = "0";
            if (document.getElementsByTagName("header")[0] !== undefined) {
              document.getElementsByTagName("header")[0].style.width = "100%";
            }
            var highlights = document.getElementsByClassName("highlight-cpp");
            for (var highlight of highlights) {
              highlight.classList.remove("highlight-cpp");


            }
          }
          if (document.getElementsByTagName("header")[0] !== undefined) {
            document.getElementsByTagName("header")[0].style.width = "100%";
          }


        }
      });

      dragElement($(`#${id}`)[0]);
    }
  }
}



function closeAllBoxes() {
  var boxes = document.getElementsByClassName("overlay-cpp");
  for (var box of boxes) {
    if (box.style.width == "30%") {
      box.style.width = "0%";
      document.body.style.marginRight = "0";
      if (document.getElementsByTagName("header")[0] !== undefined) {
        document.getElementsByTagName("header")[0].style.width = "100%";
      }
      var highlights = document.getElementsByClassName("highlight-cpp");
      for (var highlight of highlights) {
        highlight.classList.remove("highlight-cpp");
      }
    }
  }
}

function createTextField(predicate, sentences, textId) {
  var list = document.createElement("UL");
  list.classList.add("cppUL");
  for (var sentence in sentences) {
    var listElement = document.createElement("LI");
    listElement.classList.add("cppLI");
    var innerList = document.createTextNode(sentences[sentence]);
    listElement.appendChild(innerList);
    list.appendChild(listElement);
  }
  var text = document.createElement("div");
  var header = document.createElement("h3");
  var explanation = document.createElement("p");
  explanation.classList.add("cpp-explanation");
  explanation.innerHTML = categoriesToExplanaitionMap.get(predicate);
  header.classList.add("cppHeader");
  header.innerHTML = HtmlSanitizer.SanitizeHtml(predicate);
  header.appendChild(explanation);
  text.appendChild(header);
  text.appendChild(list);

  // the icon for category
  var image = document.createElement("img");
  if (predicate == "Analytics/Research") {
    image.src = browser.runtime.getURL(`icons/Analytics_Logo.png`);
  } else {
    image.src = browser.runtime.getURL(`icons/${predicate}_Logo.png`);
  }
  image.classList.add("categoryImage");
  text.insertAdjacentElement('afterbegin', image);

  text.classList.add("cppText");
  // text.setAttribute("id", textId);

  var overlay = document.createElement('overlay');
  overlay.classList.add("overlay-cpp");
  overlay.setAttribute('id', textId);

  overlay.appendChild(text);
  overlay.style.width = "0%";

  document.body.appendChild(overlay);
  $('#overlayBox').click(function(event) {
    event.stopPropagation();
  });
  return overlay;
}

function toggleTextBox(textId) {
  var box = document.getElementById(textId);
  if (box.style.width == "0%") {
    box.style.width = "30%";
  } else {
    box.style.width = "0%";
  }
}

$(window).click(function() {
  var boxes = document.getElementsByClassName("overlay-cpp");
  for (var box of boxes) {
    if (box.style.width == "30%") {
      box.style.width = "0%";
      document.body.style.marginRight = "0";
      if (document.getElementsByTagName("header")[0] !== undefined) {
        document.getElementsByTagName("header")[0].style.width = "100%";
      }
      var highlights = document.getElementsByClassName("highlight-cpp");
      for (var highlight of highlights) {
        highlight.classList.remove("highlight-cpp");
      }
    }
  }
});


$(window).click(function() {
  var boxes = document.getElementsByClassName("overlay-cpp");
  for (var box of boxes) {
    if (box.style.width == "30%") {
      box.style.width = "0%";
      document.body.style.marginRight = "0";
      if (document.getElementsByTagName("header")[0] !== undefined) {
        document.getElementsByTagName("header")[0].style.width = "100%";
      }
      var highlights = document.getElementsByClassName("highlight-cpp");
      for (var highlight of highlights) {
        highlight.classList.remove("highlight-cpp");
      }
    }
  }
});



function extractInfoToDisplay(result, predicate, isMainCategory) {
  var segments = result.data[1];
  var predictionsObject;
  if (isMainCategory === true) {
    predictionsObject = result.data[0][0];
  } else {
    predictionsObject = result.data[0][1];
  }
  var predictions = predictionsObject[1];
  var sentencesToShow = [];
  for (package in predictions) {
    var predictionPackage = predictions[package];
    for (i = 1; i < predictionPackage.length; i++) {
      var predictionPair = predictionPackage[i][0];
      if (predictionPair[1] === predicate) {
        var sentenceIndex = predictionPackage[0];
        // getAllPredictionsForSentence(sentenceIndex, result.data[0][0], result.data[0][1]);
        sentencesToShow.push(segments[sentenceIndex]);
      }
    }
  }
  sentencesToShow = [...new Set(sentencesToShow)];
  return sentencesToShow;
}

function getAllPredictionsForSentence(index, mainPredictions, attributePredictions) {
  var object = {};
  for (var prediction of attributePredictions[1]) {

    if (prediction[0] == index) {
      for (var i = 1; i < prediction.length; i++) {
        // console.log("object[prediction[i][0]", object[prediction[i][0]);
        if (object[prediction[i][0]][prediction[i][1]] == undefined) {
          object[prediction[i][0]][prediction[i][1]] = [];
        } else {
          object[prediction[i][0]][prediction[i][1]].push(prediction[0]);
        }
      }

      // console.log("prediction", object);
    }
  }
}

function getElementByText(possibleTags, keywords, predicate, results) {
  for (const tag of possibleTags) {
    for (const a of document.querySelectorAll(tag)) {
      for (const word of keywords) {
        if (a.textContent.includes(word)) {
          showPPInfo(a, results, predicate, false);
        }
      }
    }
  }
}

function showPPInfoForAds(result) {
  if (!window.location.href.includes("facebook")) {
    var all = document.getElementsByTagName("*");
    document.querySelectorAll('*').forEach(function(element) {
      var element = element.getAttribute("class");
      if (typeof element === 'string') {
        element = element.split(" ");
        element.forEach(function(splitElement) {
          if (splitElement.includes("Ad") || splitElement.includes("ads") || splitElement.includes("advertisement") || splitElement.includes("advert")) {
            var splitElementAsDocElement = document.getElementsByClassName(splitElement);
            for (let element of splitElementAsDocElement) {
              showPPInfo(element, result, "Advertising", false);
            }
          }
        });
      }
    });
  }
}

function getElementByClassName(keywords, predicate, result) {
  if (!window.location.href.includes("facebook")) {
    var all = document.getElementsByTagName("*");
    document.querySelectorAll('*').forEach(function(superElement) {
      var element = superElement.getAttribute("class");
      if (typeof element === 'string') {
        element = element.split(" ");
        element.forEach(function(splitElement) {
          for (const keyword of keywords) {
            if (splitElement.includes(keyword)) {
              var splitElementAsDocElement = document.getElementsByClassName(splitElement);
              showPPInfo(splitElementAsDocElement[0], result, predicate, false);

            }
          }
        });
      }
    });
  }
}

function getElementById(keywords, predicate, result) {
  if (!window.location.href.includes("facebook")) {
    var all = document.getElementsByTagName("*");
    document.querySelectorAll('*').forEach(function(superElement) {
      var element = superElement.getAttribute("class");
      var id = superElement.getAttribute("id");
      if (typeof id === 'string') {
        id = id.split(" ");
        id.forEach(function(splitElement) {
          for (const keyword of keywords) {
            if (splitElement.includes(keyword)) {
              var splitElementAsDocElement = document.getElementById(splitElement);
              showPPInfo(splitElementAsDocElement, result, predicate, false);

            }
          }
        });
      }
    });
  }
}

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;

  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }


  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function showPPInfoForAccount(result) {
  keywords = ["account", "Account", "login", "signin", "login", "log-in", "profile", "Sign in"];
  getLinkElementsByKeywords(keywords, result, 'User with account');
}

function showPPInfoForSocialMedia(result) {
  keywords = ["facebook", "instagram", "twitter", "pinterest"];
  getLinkElementsByKeywords(keywords, result, 'Social media data');
}


function showPPInfoForAdLinks(result) {
  keywords = ["ads"];
  getLinkElementsByKeywords(keywords, result, "Advertising");
}

function showPPInfoForBuyingStuff(result) {
  keywords = ["checkout", "cart", "order"];
  getLinkElementsByKeywords(keywords, result, 'Financial');
}

function showPPInfoForCookies(result) {
  keywords = ["cookie"];
  getLinkElementsByKeywords(keywords, result, 'Cookies and tracking elements');
}


window.browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action == "deleteCpps") {
    var elements = document.getElementsByClassName("cppBox");
    while (elements.length > 0) {
      console.log(elements[0])
      elements[0].parentNode.removeChild(elements[0]);
    }
  }
  if (message.action == "highlightQuestionnaireBubble") {
    if (message.data !== 0) {
      bubbles[message.data - 1].classList.remove("highlight-questionnaire");
    }
    bubbles[message.data].classList.add("highlight-questionnaire");
    var headerOffset = 5;
    var elementPosition = bubbles[message.data].getBoundingClientRect().bottom;
    // var offsetPosition = elementPosition - headerOffset;
    // window.scrollTo({
    //   top: elementPosition,
    //   behavior: "smooth"
    // });
    bubbles[message.data].scrollIntoView();
    var currentHighlightBubble = bubbles[message.data];
    var response = {
      "bubble": bubbles[message.data].getAttribute('category')
    };
    sendResponse(response);
  }
  if (message.action == "getPageUrlForQuestionnaire") {
    sendResponse(window.location.toString());
  }
  if (message.action == "questionnaireFinish") {
    bubbles[bubbles.length - 1].classList.remove("highlight-questionnaire");
    sendResponse();
  }
  return true;
});


function getLinkElementsByKeywords(keywords, result, category) {
  if (window.location.host.includes("facebook")) {
    if (category == "User with account") {
      url = "/me/";
      var elementForUrl = document.querySelectorAll(`a[href='${url}']`);
      if (elementForUrl[0] != null) {
        showPPInfo(elementForUrl[0], result, category, false);
      }
    }
    if (category == "Advertising") {
      hrefs = document.getElementsByClassName("oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl gmql0nx0 gpro0wi8 b1v8xokw");
      for (let element of hrefs) {
        if (!hasWhitespace(element.textContent)) {
          showPPInfo(element, result, category, false);
        }
      }
    }
  } else {
    var allLinkTexts = [];
    var allLinks = document.getElementsByTagName("a");
    for (var link of allLinks) {
      var notNullLink = link.getAttribute("href");
      if (notNullLink != null) {
        allLinkTexts.push(notNullLink);
      }

    }
    var matchingUrls = allLinkTexts.filter(pageUrl => keywords.find(urlKeyword => pageUrl.includes(urlKeyword)));
    for (let url of matchingUrls) {
      if (url.substr(url.length - 1) === "/" && keywords[0] !== "facebook") {
        url = url.substring(0, url.length - 1);
      }
      try {
        var elementForUrl = document.querySelectorAll(`a[href="${url}"]`);
      } catch (e) {
        console.log(e);
      }

      if (elementForUrl[0] != null) {
        showPPInfo(elementForUrl[0], result, category, false);
      }
    }
  }
}

function getSegments(url) {
  return new Promise((resolve, reject) => {
    window.browser.runtime.sendMessage({
        title: "getSegments",
        data: url
      },
      segments => {
        resolve(segments);
      });
  });
}

function getPPAnalysis(segments) {
  return new Promise((resolve, reject) => {
    window.browser.runtime.sendMessage({
        title: "predictPP",
        data: segments
      },
      url => {
        resolve(url);
      });
  });
}



// code is adjusted from https://github.com/YuanhaoSun/ChromePP
function getScoreForUrl(url) {
  return new Promise((resolve, reject) => {
    window.browser.runtime.sendMessage({
        title: "getPrivacyPolicyText",
        url: url.href
      },
      ppText => {
        var regex_PP = /privacy.?polic/gi;
        var regex_statement = /privacy.?statement/gi;
        var regex_notice = /privacy.?notice/gi;
        //Detector elements
        var regex_policy = /polic(y|ies)/gi;
        //var regex_cookies = /cooki/gi;
        var regex_pii = /personal.?info/gi;
        var regex_ssl = /(\WSSL|encrypt|safeguard)/gi;
        //Grader elements
        var regex_children = /children/gi;
        var regex_safeharbor = /safe.?harbor/gi;
        var regex_truste = /truste/gi;
        var regex_third = /third.?part/gi;
        var regex_choice = /(choice|opt.?(out|in))/gi;
        var regex_location = /location/gi;
        var regex_ads = /(\sads|advertis)/gi; //Only matech ads with a space in front
        var regex_collect = /collect/gi;
        var regex_share = /(share|disclos)/gi;

        //Numerial variables for counts of words/phrase
        var length_PP = 0;
        var length_statement = 0;
        var length_notice = 0;
        var length_cookies = 0;
        var length_policy = 0;
        var length_pii = 0;
        var length_ssl = 0;
        var length_children = 0;
        var length_safeharbor = 0;
        var length_truste = 0;
        var length_third = 0;
        var length_choice = 0;
        var length_location = 0;
        var length_ads = 0;
        var length_collect = 0;
        var length_share = 0;

        //Booleans for grading
        var boolean_cookies = 0;
        var boolean_ssl = 0;
        var boolean_children = 0;
        var boolean_safeharbor = 0;
        var boolean_truste = 0;
        var boolean_third = 0;
        var boolean_choice = 0;
        var boolean_location = 0;
        var boolean_ads = 0;
        var boolean_collect = 0;
        var boolean_share = 0;

        //Match the regex's
        matches_PP = ppText.match(regex_PP);
        matches_statement = ppText.match(regex_statement);
        matches_notice = ppText.match(regex_notice);
        //  matches_cookies = ppText.match(regex_cookies);
        matches_policy = ppText.match(regex_policy);
        matches_pii = ppText.match(regex_pii);
        matches_ssl = ppText.match(regex_ssl);
        //Grader
        matches_children = ppText.match(regex_children);
        matches_safeharbor = ppText.match(regex_safeharbor);
        matches_truste = ppText.match(regex_truste);
        matches_third = ppText.match(regex_third);
        matches_choice = ppText.match(regex_choice);
        matches_location = ppText.match(regex_location);
        matches_ads = ppText.match(regex_ads);
        matches_collect = ppText.match(regex_collect);
        matches_share = ppText.match(regex_share);

        //Count matches
        if (matches_PP) {
          length_PP = matches_PP.length;
        }
        if (matches_statement) {
          length_statement = matches_statement.length;
        }
        if (matches_notice) {
          length_notice = matches_notice.length;
        }
        // if (matches_cookies) {
        //   length_cookies = matches_cookies.length;
        //   boolean_cookies = 1;
        // }
        if (matches_policy) {
          length_policy = matches_policy.length;
        }
        if (matches_pii) {
          length_pii = matches_pii.length;
        }
        if (matches_ssl) {
          length_ssl = matches_ssl.length;
          boolean_ssl = 1;
        }
        //Grader
        if (matches_children) {
          length_children = matches_children.length;
          boolean_children = 1;
        }
        if (matches_safeharbor) {
          length_safeharbor = matches_safeharbor.length;
          boolean_safeharbor = 2;
        }
        if (matches_truste) {
          length_truste = matches_truste.length;
          boolean_truste = 1;
        }
        if (matches_third) {
          length_third = matches_third.length;
          boolean_third = 1;
        }
        if (matches_choice) {
          length_choice = matches_choice.length;
          boolean_choice = 1;
        }
        if (matches_location) {
          length_location = matches_location.length;
        }
        if (matches_ads) {
          length_ads = matches_ads.length;
          boolean_ads = 1;
        }
        if (matches_collect) {
          length_collect = matches_collect.length;
          boolean_collect = 1;
        }
        if (matches_share) {
          length_share = matches_share.length;
          boolean_share = 1;
        }

        if (length_location >= 5) {
          boolean_location = 0.5;
        }

        var first_detect = length_PP + length_statement + length_notice;
        var final_detect = 0;

        if (first_detect < 2) {
          final_detect = first_detect;
        } else if (first_detect >= 2 && first_detect <= 10) {
          final_detect = first_detect + length_cookies * 2 + length_policy / 2 + length_pii + length_ssl + length_collect / 2 + length_choice / 2;
        } else {
          final_detect = first_detect + 10;
        }

        var urlWithScore = {
          count: final_detect, // Pass detector score
          url: url.href,
          ppText: ppText
        };
        resolve(urlWithScore);
      });
  });
}
