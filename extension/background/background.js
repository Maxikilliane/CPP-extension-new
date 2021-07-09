/*jshint esversion: 6 */

window.browser = (function() {
  return window.msBrowser ||
    window.browser ||
    window.chrome;
})();


var bubbles;
var counter = -1;
var currentCategory;
var currentUrl;

window.browser.runtime.onInstalled.addListener(function(details) {
  window.browser.storage.local.get(["userId"], function(result) {
    var userId = result.userId;
    if (!userId) {
      userId = getRandomToken();
      window.browser.storage.local.set({
        "userId": userId
      });
    }
  });
  window.browser.storage.local.get(["questionnaireData"], function(result) {
    window.browser.storage.local.set({
      "questionnaireData": {}
    });
  });
  window.browser.storage.local.get(["isFirstTime"], function(result) {
    window.browser.storage.local.set({
      "isFirstTime": true
    });
  });
  window.browser.storage.local.get(["overallProgress"], function(result) {
    window.browser.storage.local.set({
      "overallProgress": 0
    });
  });
});

function getRandomToken() {
  // E.g. 8 * 32 = 256 bits token
  var randomPool = new Uint8Array(32);
  crypto.getRandomValues(randomPool);
  var hex = '';
  for (var i = 0; i < randomPool.length; ++i) {
    hex += randomPool[i].toString(16);
  }
  // E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
  return hex;
}


window.browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
    window.browser.tabs.executeScript(null, {
      file: "content_scripts/contentScript.js"
    }, function() {});
    counter = -1;
  }
});

window.browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.title == "predictPP") {
    var data = {
      "segments": request.data
    };
    $.ajax({
      url: `http://127.0.0.1:5000/predict`,
      // url: `https://contextual-pp-backend.herokuapp.com/predict`,
      contentType: "application/json; charset=utf-8",
      type: "POST",
      dataType: 'json',
      data: JSON.stringify(data),
      success: function(data, status, request) {
        status_url = request.getResponseHeader('Location');
        sendResponse(status_url);
      },
      error: function(e, s, t) {
        showErrorBadge();
        sendResponse(e, s, t);
      }
    });
    return true;
  }

  if (request.title == "getSegments") {
    var url = {
      "url": request.data
    };
    $.ajax({
      url: `http://127.0.0.1:5000/segments`,
      // url: `https://contextuafl-pp-backend.herokuapp.com/segments`,
      type: "POST",
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(url),
      success: function(data, status, request) {
        status_url = request.getResponseHeader('Location');
        sendResponse(status_url);
      },
      error: function(e, s, t) {
        showErrorBadge();
        sendResponse(e, s, t);
      }
    });
    return true;
  }
  if (request.message == "showError") {
    showErrorBadge();
    return true;
  }
  if (request.message == "showSuccess" && counter == -1) {
    showSuccessBadge();
    return true;
  }

  if (request.message == "bubbles") {
    bubbles = request.data;
    chrome.extension.onConnect.addListener(function(port) {
      port.onMessage.addListener(function(msg) {
        var message = {
          subject: "bubbleTime",
          data: counter
        };
        port.postMessage(message);
      });
    });
    return true;
  }


  if (request.title == "getPrivacyPolicyText") {
    getHTML(request.url, function(response) {
      ppText = response.documentElement.innerHTML;
      ppTextAsDom = document.createElement('html');
      ppTextAsDom.innerHTML = ppText;
      ppTextAsDom = ppTextAsDom.getElementsByTagName("body")[0].innerText;
      showGeneratingBadge();
      sendResponse(ppTextAsDom);
    });
    return true;
  }
  if (request.message === "saveAnnotation") {
    saveCurrentAnnotations(request);
  }
  if (request.message === "resetQuestionnaireStatus") {
    window.browser.storage.local.set({
      "questionnaireProgress": null
    });
    return true;
  }

  if (request.message === "disablePlugin") {
    var getUserId = new Promise((resolve, reject) => {
      window.browser.storage.local.get(["userId"], userId => {
        resolve(userId);
      });
    });
    getUserId.then(function(userId) {
      var host = new URL(request.url).hostname;
      window.browser.storage.local.get(["blockedURLs"], function(result) {
        if (result.blockedURLs === undefined) {
          result.blockedURLs = [];
        }
        if (request.checked) {
          result.blockedURLs.push(host);
        } else {
          result.blockedURLs = result.blockedURLs.filter(item => item !== host);
        }
        window.browser.storage.local.set({
          "blockedURLs": result.blockedURLs
        });
        var disablePlugin = {
          "userId": userId.userId,
          "urls": result.blockedURLs
        };
        console.log(disablePlugin);

        $.ajax({
          url: `http://127.0.0.1:5000/saveDisabledSites`,
          // url: `https://contextual-pp-backend.herokuapp.com/saveDisabledSites`,
          type: "POST",
          dataType: 'json',
          contentType: 'application/json; charset=utf-8',
          data: JSON.stringify(disablePlugin),
          success: function(data, status) {},
          error: function(e, s, t) {}
        });
      });
    });
  }
  if (request.message === "saveDemographics") {
    window.browser.storage.local.get(["isFirstTime"], function(result) {
      window.browser.storage.local.set({
        "isFirstTime": false
      });
    });
    var getUserId = new Promise((resolve, reject) => {
      window.browser.storage.local.get(["userId"], userId => {
        resolve(userId);
      });
    });
    getUserId.then(function(userId) {
      var demographics = {
        "userId": userId.userId,
        "gender": request.gender,
        "age": request.age,
        "occupation": request.occupation,
        "occupationDesc": request.occupationDesc
      };
      $.ajax({
        url: `http://127.0.0.1:5000/saveDemographics`,
        // url: `https://contextual-pp-backend.herokuapp.com/saveDemographics`,
        type: "POST",
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(demographics),
        success: function(data, status) {},
        error: function(e, s, t) {}
      });
    });
  }
  if (request.message === "updateQuestionnaireRating") {

    var getUrl = new Promise((resolve, reject) => {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "getPageUrlForQuestionnaire"
        }, function(response) {
          resolve(response);
        });
      });
    });

    // getUrl.then(function(url) {
    //
    //   currentUrl = url;
    //
    //   window.browser.storage.local.get(["questionnaireData"], function(questionnaireData) {
    //
    //     var getUserId = new Promise((resolve, reject) => {
    //       window.browser.storage.local.get(["userId"], userId => {
    //         resolve(userId);
    //       });
    //     });
    //     getUserId.then(function(userId) {
    //
    //       var entry;
    //       var ratings;
    //
    //       if (!(url in questionnaireData["questionnaireData"])) {
    //         entry = {};
    //         ratings = {};
    //         ratings[counter] = {};
    //         entry["userId"] = userId;
    //         entry["ratings"] = [];
    //         entry["ratings"] = ratings;
    //         questionnaireData["questionnaireData"][url] = entry;
    //       } else {
    //         entry = questionnaireData["questionnaireData"][url];
    //         ratings = questionnaireData["questionnaireData"][url]["ratings"];
    //         console.log("retrievedRatings", ratings)
    //       }
    //
    //       if (ratings[counter] === undefined) {
    //         ratings[counter] = {};
    //       }
    //
    //       var type = request.type;
    //       var assessment = request.rating;
    //
    //       ratings[counter]["number"] = counter;
    //       ratings[counter]["userId"] = userId.userId;
    //       ratings[counter]["url"] = currentUrl;
    //       ratings[counter]["bubbleCategory"] = currentCategory;
    //       ratings[counter]["notVisible"] = false;
    //       ratings[counter][type] = assessment;
    //
    //       entry["ratings"] = ratings;
    //       questionnaireData["questionnaireData"][url] = entry;
    //
    //       if (questionnaireData["questionnaireData"] != undefined) {
    //         questionnaireData = questionnaireData["questionnaireData"];
    //       }
    //       window.browser.storage.local.set({
    //         "questionnaireData": questionnaireData
    //       });
    //     });
    //   });
    // });
    // console.log("questionnaire", request.type, request.rating);
  }
  if (request.message === "getAnnotation") {
    console.log("get annotation")
    var promise = new Promise(function(resolve, reject) {

      const getUserId = new Promise((resolve, reject) => {
        window.browser.storage.local.get(["userId"], userId => {
          resolve(userId);
        });
      });
      getUserId.then(function(userId) {
        var promise = new Promise(function(resolve, reject) {
          $.ajax({
            url: `http://127.0.0.1:5000/getDisabledSites`,
            // url: `https://contextual-pp-backend.herokuapp.com/getDisabledSites`,
            type: "POST",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
              "userId": userId
            }),
            success: function(data, status) {
              console.log("get annotation 2", data.urls);
              if (data.urls == null || !data.urls[0].includes(request.url)) {
                console.log("get annotation 3");
                $.ajax({
                  url: `http://127.0.0.1:5000/getAnnotation`,
                  // url: `https://contextual-pp-backend.herokuapp.com/getAnnotation`,
                  type: "POST",
                  dataType: 'json',
                  contentType: 'application/json; charset=utf-8',
                  data: JSON.stringify({
                    "url": request.url
                  }),
                  success: function(data, status) {
                    console.log("im resolve", data)
                    saveCurrentAnnotationsToLocalStorage(request.url, data);
                    sendResponse(data);
                  },
                  error: function(e, s, t) {
                    showErrorBadge();
                    sendResponse(e, s, t);
                  }
                });
              }
            },
            error: function(e, s, t) {
              sendResponse(e, s, t);
            }
          });
        });
      });
    });

    promise.then(function(result) {
      sendResponse(result);
    });

    return true;
  }
  if (request.message === "questionnaireStatus") {
    window.browser.storage.local.get(["questionnaireProgress"], function(result) {
      sendResponse(result.questionnaireProgress);
    });
    return true;
  }
  if (request.message === "disabledUrls") {
    const promise = new Promise(function(resolve, reject) {

      const getUserId = new Promise((resolve, reject) => {
        window.browser.storage.local.get(["userId"], userId => {
          resolve(userId);
        });
      });
      getUserId.then(function(userId) {
        var promise = new Promise(function(resolve, reject) {
          $.ajax({
            url: `http://127.0.0.1:5000/getDisabledSites`,
            // url: `https://contextual-pp-backend.herokuapp.com/getDisabledSites`,
            type: "POST",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
              "userId": userId
            }),
            success: function(data, status) {
              console.log("HALLO", data.urls);
              if (data.urls !== null) {
                console.log("checkbox checked", request.url,data.urls[0].includes(request.url))
                sendResponse(data.urls[0].includes(request.url));
              } else {
                sendResponse(false);
              }
            },
            error: function(e, s, t) {
              sendResponse(e, s, t);
            }
          });
        });
      });
    });
    promise.then(function(result) {
      sendResponse(result);
    });
    return true;
  }
  if (request.message === "questionnaireRatings") {


    var getRatings = new Promise((resolve, reject) => {
      window.browser.storage.local.get(["questionnaireData"], function(result) {
        console.log(result["questionnaireData"][currentUrl])
        if (result["questionnaireData"][currentUrl] !== undefined)
          if (result["questionnaireData"][currentUrl]["ratings"] !== undefined) {
            console.log("JSON", JSON.stringify(result["questionnaireData"][currentUrl]["ratings"]))
            resolve(JSON.stringify(result["questionnaireData"][currentUrl]["ratings"]));
          }

      });
    });
    getRatings.then(function(result) {
      sendResponse(result);
    });

    return true;
  }
  if (request.message === "feedback") {
    var bugReport = {
      "url": request.url,
      "bugReport": request.bugReport
    };
    $.ajax({
      url: `http://127.0.0.1:5000/saveBugReport`,
      // url: `https://contextual-pp-backend.herokuapp.com/saveBugReport`,
      type: "POST",
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(bugReport),
      success: function(data, status) {
        chrome.notifications.create({
          "type": "basic",
          "iconUrl": browser.extension.getURL("icons/icon_cpp.png"),
          "title": "Thank you!",
          "message": "Your feedback was sent successfully."
        });
      },
      error: function(e, s, t) {}
    });


  }
});

var getHTML = function(url, callback) {
  if (!window.XMLHttpRequest) {
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (callback && typeof(callback) === 'function') {
      callback(this.responseXML);
    }
  };
  xhr.open('GET', url);
  xhr.responseType = 'document';
  xhr.send();
};

function showErrorBadge() {
  window.browser.browserAction.setBadgeBackgroundColor({
    color: "white"
  });
  window.browser.browserAction.setBadgeText({
    text: "⛔"
  });

  chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
      var msg = {
        subject: "Error",
        content: "Unfortunately, the plugin does not work on this page. This is probably because the privacy policy can not be found or the policy is not in English."
      };
      port.postMessage(msg);
    });
  });

}

chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    var getIsFirstTime = new Promise((resolve, reject) => {
      window.browser.storage.local.get(["isFirstTime"], isFirstTime => {
        resolve(isFirstTime);
      });
    });
    getIsFirstTime.then(function(isFirstTime) {
      if (msg == "questionnaireNoBubbles") {
        console.log("no bubbles")
        saveNoBubblesData(port);
      }
      if (msg == "questionnaire") {
        if (isFirstTime.isFirstTime == true) {
          var demogrpahicsMsg = {
            subject: "showDemographics"
          }
          console.log("showDemographics")
          port.postMessage(demogrpahicsMsg);
        } else {
          if (counter < bubbles.length - 1) {
            window.browser.storage.local.get(["questionnaireProgress"], function(result) {
              window.browser.storage.local.set({
                "questionnaireProgress": counter
              });
            });
            counter = counter + 1;
            console.log("COUNTER", counter)
            chrome.tabs.query({
              active: true,
              currentWindow: true
            }, function(tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {
                action: "highlightQuestionnaireBubble",
                data: counter
              }, function(response) {
                currentCategory = response.bubble;
                console.log("antwort vom content:", response);
                var msg = {
                  subject: "showQuestionnaire",
                  content: response
                };
                port.postMessage(msg);
              });
            });
            console.log("message received!")
          } else {
            saveQuestionnaireData();
            window.browser.storage.local.get(["overallProgress"], function(result) {
              var newProgress = result.overallProgress + 1;
              if (newProgress == 6) {
                alert("Thank you, you finished all your questionnaires! 🥳 You can remove the extension now. If you want course credits for your participation, send the code below to: maximiliane.windl@stud.uni-regensburg.de \n\nCode: trapdoor-ruler-giraffe");
              }
              window.browser.storage.local.set({
                "overallProgress": newProgress
              });
            });
            window.browser.storage.local.get(["questionnaireData"], function(result) {
              window.browser.storage.local.set({
                "questionnaireData": {}
              });
            });
            window.browser.storage.local.get(["questionnaireProgress"], function(result) {
              window.browser.storage.local.set({
                "questionnaireProgress": "finish"
              });
            });
            console.log("finish")
            chrome.tabs.query({
              active: true,
              currentWindow: true
            }, function(tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {
                action: "questionnaireFinish"
              }, function(response) {
                var msg = {
                  subject: "finishQuestionnaire"
                };
                port.postMessage(msg);
              });
            });
          }
        }
      }
    });
    return true;
  });
  return true;
});

function saveNoBubblesData(port) {

  var getUrl = new Promise((resolve, reject) => {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "getPageUrlForQuestionnaire"
      }, function(response) {
        resolve(response);
      });
    });
  });

  getUrl.then(function(url) {

    currentUrl = url;

    window.browser.storage.local.get(["questionnaireData"], function(questionnaireData) {

      var getUserId = new Promise((resolve, reject) => {
        window.browser.storage.local.get(["userId"], userId => {
          resolve(userId);
        });
      });
      getUserId.then(function(userId) {

        var entry;
        var ratings;

        if (!(url in questionnaireData["questionnaireData"])) {
          entry = {};
          ratings = {};
          ratings[counter] = {};
          entry["userId"] = userId;
          entry["ratings"] = [];
          entry["ratings"] = ratings;
          questionnaireData["questionnaireData"][url] = entry;
        } else {
          entry = questionnaireData["questionnaireData"][url];
          ratings = questionnaireData["questionnaireData"][url]["ratings"];
          console.log("retrievedRatings", ratings)
        }

        if (ratings[counter] === undefined) {
          ratings[counter] = {};
        }

        ratings[counter]["number"] = counter;
        ratings[counter]["userId"] = userId.userId;
        ratings[counter]["url"] = currentUrl;
        ratings[counter]["bubbleCategory"] = currentCategory;
        ratings[counter]["notVisible"] = true;
        ratings[counter]["ratingCategoryAndPlacement"] = 0;
        ratings[counter]["ratingCategoryAndText"] = 0;
        ratings[counter]["ratingVisibiliyBubble"] = 0;
        ratings[counter]["ratingVisibiliySidebar"] = 0;

        entry["ratings"] = ratings;
        questionnaireData["questionnaireData"][url] = entry;

        if (questionnaireData["questionnaireData"] != undefined) {
          questionnaireData = questionnaireData["questionnaireData"];
        }
        window.browser.storage.local.set({
          "questionnaireData": questionnaireData
        });
        if (counter < bubbles.length - 1) {
          window.browser.storage.local.get(["questionnaireProgress"], function(result) {
            window.browser.storage.local.set({
              "questionnaireProgress": counter
            });
          });
          counter = counter + 1;
          console.log("COUNTER", counter)
          chrome.tabs.query({
            active: true,
            currentWindow: true
          }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: "highlightQuestionnaireBubble",
              data: counter
            }, function(response) {
              currentCategory = response.bubble;
              console.log("antwort vom content:", response);
              var msg = {
                subject: "showQuestionnaire",
                content: response
              };
              port.postMessage(msg);
            });
          });
          console.log("message received!")
        } else {
          saveQuestionnaireData();
          window.browser.storage.local.get(["overallProgress"], function(result) {
            var newProgress = result.overallProgress + 1;
            if (newProgress == 1) {
              alert("Thank you, you finished all your questionnaires! 🥳 You can remove the extension now. If you want course credits for your participation, send the code below to: maximiliane.windl@stud.uni-regensburg.de \n\nCode: trapdoor-ruler-giraffe");
            }
            window.browser.storage.local.set({
              "overallProgress": newProgress
            });
          });
          window.browser.storage.local.get(["questionnaireData"], function(result) {
            window.browser.storage.local.set({
              "questionnaireData": {}
            });
          });
          window.browser.storage.local.get(["questionnaireProgress"], function(result) {
            window.browser.storage.local.set({
              "questionnaireProgress": "finish"
            });
          });
          console.log("finish")
          chrome.tabs.query({
            active: true,
            currentWindow: true
          }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: "questionnaireFinish"
            }, function(response) {
              var msg = {
                subject: "finishQuestionnaire"
              };
              port.postMessage(msg);
            });
          });
        }
      });
    });
  });
}

function showSuccessBadge() {

  window.browser.browserAction.setBadgeBackgroundColor({
    color: "green"
  });
  window.browser.browserAction.setBadgeText({
    text: "✓"
  });

  chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
      var msg = {
        subject: "Success!",
        content: "The CPPs were successfully generated. Please click on the icons to read the privacy information."
      };
      port.postMessage(msg);
    });
  });

}

function showGeneratingBadge() {
  window.browser.browserAction.setBadgeBackgroundColor({
    color: "white"
  });
  window.browser.browserAction.setBadgeText({
    text: "🔄"
  });

  chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
      var msg = {
        subject: "Generating",
        content: "The plugin currently works on generating the CPP snippets. Depending on the length of the policy this can take up to 4 minutes."
      };
      port.postMessage(msg);
    });
  });

}

function saveQuestionnaireData() {
  var getCurrentQuestionnaireRatings = new Promise((resolve, reject) => {
    window.browser.storage.local.get(["questionnaireData"], function(result) {
      console.log(result["questionnaireData"][currentUrl])
      if (result["questionnaireData"][currentUrl] !== undefined) {
        resolve(result["questionnaireData"][currentUrl]);
      }
    });
  });

  getCurrentQuestionnaireRatings.then(function(result) {
    var dataToSave = {
      "userId": result["userId"]["userId"],
      "url": currentUrl,
      "ratings": result["ratings"]
    };
    $.ajax({
      url: `http://127.0.0.1:5000/saveQuestionnaireData`,
      // url: `https://contextual-pp-backend.herokuapp.com/saveQuestionnaireData`,
      type: "POST",
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(dataToSave),
      success: function(data, status) {},
      error: function(e, s, t) {}
    });
  });
}

function saveCurrentAnnotations(request) {
  console.log(dataToSave);
  var dataToSave = {
    "baseUrl": request.baseUrl,
    "data": request.data
  };
  $.ajax({
    url: `http://127.0.0.1:5000/saveAnnotation`,
    // url: `https://contextual-pp-backend.herokuapp.com/saveAnnotation`,
    type: "POST",
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(dataToSave),
    success: function(data, status) {
      saveCurrentAnnotationsToLocalStorageNew(request);
    },
    error: function(e, s, t) {}
  });
}

function saveCurrentAnnotationsToLocalStorageNew(request) {
  window.browser.storage.local.get(["currentAnnotation"], function(result) {
    var newEntry = {
      "baseUrl": request.baseUrl,
      "data": request.data
    };
    window.browser.storage.local.set({
      "currentAnnotation": newEntry
    });
  });
}

function saveCurrentAnnotationsToLocalStorage(url, data) {
  window.browser.storage.local.get(["currentAnnotation"], function(result) {
    var newEntry = {
      "baseUrl": url,
      "data": data.data
    };
    window.browser.storage.local.set({
      "currentAnnotation": newEntry
    });
  });
}


window.browser.commands.onCommand.addListener(function(command) {
  if (command == "delete-cpps") {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "deleteCpps"
      }, function(response) {});
    });
  }
  return true;
});
