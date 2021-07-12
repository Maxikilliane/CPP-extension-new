/*jshint esversion: 6 */
(function() {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  window.browser = (function() {
    return window.msBrowser || chrome;
  })();

  // var questionnaireButton = document.getElementById("questionnaireButton");
  // questionnaireButton.style.display = "none";

  var disablePluginCheckbox = document.getElementById("disablePlugin");
  disablePluginCheckbox.addEventListener('change', function() {
    tab = chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {

      var currentTab = tabs[0]; // there will be only one in this array
      window.browser.runtime.sendMessage({
          message: "disablePlugin",
          url: currentTab.url,
          checked: disablePluginCheckbox.checked
        },
        function(response) {});
    });
    console.log("Checkbox is checked..", disablePluginCheckbox.checked);
  });

  var enableUpdatesCheckbox = document.getElementById("enableUpdates");
  enableUpdatesCheckbox.addEventListener('change', function() {
    tab = chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {

      var currentTab = tabs[0]; // there will be only one in this array
      window.browser.runtime.sendMessage({
          message: "enableUpdates",
          url: currentTab.url,
          checked: enableUpdatesCheckbox.checked
        },
        function(response) {});
    });
    console.log("Enable Updates Checkbox is checked..", enableUpdatesCheckbox.checked);
  });


  var start = document.getElementById("start");
  var questionnaire = document.getElementById("questionnaire");
  // document.getElementById("errorMessage").style.display = "none";
  var end = document.getElementById("end");
  var allRadios = $('input[type=radio]');

  var noBubblesButton = document.getElementById("noBubblesButton");
  noBubblesButton.onclick = function() {
    port.postMessage("questionnaireNoBubbles");
  };

  // questionnaireButton.onclick = function() {
  //   if (questionnaireButton.textContent == "Next Bubble") {
  //
  //     if ($("input:checked").length === 4) {
  //       port.postMessage("questionnaire");
  //       document.getElementById("errorMessage").style.display = "none";
  //     } else {
  //       document.getElementById("errorMessage").style.display = "block";
  //     }
  //   } else {
  //     port.postMessage("questionnaire");
  //   }
  // };

  var getStatus = new Promise((resolve, reject) => {
    window.browser.runtime.sendMessage({
        message: "questionnaireStatus"
      },
      response => {
        resolve(response);
      });
  });

  var getRatings = new Promise((resolve, reject) => {
    window.browser.runtime.sendMessage({
        message: "questionnaireRatings"
      },
      response => {
        resolve(response);
      });
  });

  var getBlockedUrls = new Promise((resolve, reject) => {
    tab = chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {

      var currentTab = tabs[0]; // there will be only one in this array
      var host = new URL(currentTab.url).hostname;
      window.browser.runtime.sendMessage({
          message: "disabledUrls",
          url: host
        },
        response => {
          resolve(response);
          console.log("hier bin ich", response)
          document.getElementById("disablePlugin").checked = response;
        });
    });


  });

  var getOnlyUpdatesUrls = new Promise((resolve, reject) => {
    tab = chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {

      var currentTab = tabs[0]; // there will be only one in this array
      var host = new URL(currentTab.url).hostname;
      window.browser.runtime.sendMessage({
          message: "onlyUpdatesUrls",
          url: host
        },
        response => {
          resolve(response);
          console.log("hier bin ich", response)
          document.getElementById("enableUpdates").checked = response;
        });
    });


  });

  // getStatus.then(function(response) {
  //   if (response == null) {
  //     var delayInMilliseconds = 2000;
  //     setTimeout(function() {
  //       questionnaireButton.style.display = "block";
  //       questionnaireButton.style.visibility = "visible";
  //     }, delayInMilliseconds);
  //
  //
  //   } else if (response == "finish") {
  //     questionnaire.style.display = "none";
  //     questionnaireButton.style.display = "none";
  //   } else if (response >= 0) {
  //     start.style.display = "none";
  //     questionnaire.style.display = "block";
  //     questionnaireButton.style.display = "block";
  //     questionnaireButton.textContent = "Next Bubble";
  //     getRatings.then(function(ratings) {
  //       console.log("ratings", ratings);
  //       if (ratings !== undefined) {
  //         ratings = JSON.parse(ratings);
  //         if (ratings !== undefined) {
  //           if (ratings[response] !== undefined) {
  //             var currentRatings = ratings[response];
  //             var rating1 = currentRatings["ratingVisibiliyBubble"];
  //             var rating2 = currentRatings["ratingCategoryAndText"];
  //             var rating3 = currentRatings["ratingVisibiliySidebar"];
  //             var rating4 = currentRatings["ratingCategoryAndPlacement"];
  //             if (rating1 !== undefined) {
  //               var allBoxes = document.getElementsByClassName("ratingVisibiliyBubble");
  //               for (var box of allBoxes) {
  //                 if (box.getAttribute('value') === rating1) {
  //                   $(box).prop('checked', true);
  //                 }
  //               }
  //             }
  //             if (rating2 !== undefined) {
  //               var allBoxes2 = document.getElementsByClassName("ratingCategoryAndText");
  //               for (var box of allBoxes2) {
  //                 if (box.getAttribute('value') === rating2) {
  //                   $(box).prop('checked', true);
  //                 }
  //               }
  //             }
  //             if (rating3 !== undefined) {
  //               var allBoxes3 = document.getElementsByClassName("ratingVisibiliySidebar");
  //               for (var box of allBoxes3) {
  //                 if (box.getAttribute('value') === rating3) {
  //                   $(box).prop('checked', true);
  //                 }
  //               }
  //             }
  //             if (rating4 !== undefined) {
  //               var allBoxes4 = document.getElementsByClassName("ratingCategoryAndPlacement");
  //               for (var box of allBoxes4) {
  //                 if (box.getAttribute('value') === rating4) {
  //                   $(box).prop('checked', true);
  //                 }
  //               }
  //
  //             }
  //           }
  //         }
  //       }
  //     });
  //   }
  // });

  var port = chrome.extension.connect({
    name: "Sample Communication"
  });
  port.postMessage("sers");



  port.onMessage.addListener(function(msg) {
    if (msg.subject == "Success!") {
      var statusHeader = document.getElementById("statusHeader");
      // questionnaireButton.style.visibility = "visible";
      statusHeader.innerHTML = msg.subject;
      var statusText = document.getElementById("statusText");
      statusText.innerHTML = msg.content;
      document.getElementById("status").className = "";
      document.getElementById("status").classList.add("success");
      document.getElementById("annotationLink").style.display = "block";
    } else if (msg.subject == "Error") {
      // questionnaireButton.style.visibility = "hidden";
      // questionnaireButton.style.display = "none";
      var statusHeader = document.getElementById("statusHeader");
      statusHeader.innerHTML = msg.subject;
      var statusText = document.getElementById("statusText");
      statusText.innerHTML = msg.content;
      document.getElementById("status").className = "";
      document.getElementById("status").classList.add("error");
      document.getElementById("annotationLink").style.display = "none";
    } else if (msg.subject == "Generating") {
      // questionnaireButton.style.visibility = "hidden";
      var statusHeader = document.getElementById("statusHeader");
      statusHeader.innerHTML = msg.subject;
      var statusText = document.getElementById("statusText");
      statusText.innerHTML = msg.content;
      document.getElementById("status").className = "";
      document.getElementById("status").classList.add("generating");
      document.getElementById("annotationLink").style.display = "none";
    } else if (msg.subject == "showQuestionnaire") {
      document.getElementById("demographicData").style.display = "none";
      start.style.display = "none";
      questionnaire.style.display = "block";
      // questionnaireButton.textContent = "Next Bubble";
      // questionnaireButton.style.display = "block";
      // questionnaireButton.style.visibility = "visible";
      $('input[type=radio]').prop('checked', false);
    } else if (msg.subject == "finishQuestionnaire") {
      document.getElementById("demographicData").style.display = "none";
      end.style.display = "block";
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      questionnaire.style.display = "none";
      // questionnaireButton.style.display = "none";
    } else if (msg.subject === "bubbleTime" && msg.data == -1) {
      var delayInMilliseconds = 2000;
      setTimeout(function() {
        // questionnaireButton.style.display = "block";
        // questionnaireButton.style.visibility = "visible";
      }, delayInMilliseconds);
    } else if (msg.subject == "showDemographics") {
      start.style.display = "none";
      document.getElementById("demographicData").style.display = "block";
      var button = document.getElementById("demographicsButton");
      // questionnaireButton.style.display = "none";
      // questionnaireButton.style.visibility = "hidden";
      button.onclick = function() {
        var gender = $('input[group="gender"]:checked').val();
        var occupation = $('input[group="occupation"]:checked').val();
        var age = $('#demographicAge').val();
        var occupationDesc = $('#demographicOccupationDesc').val();
        if (gender !== undefined && occupation !== undefined && age != "" && occupationDesc !== "") {
          window.browser.runtime.sendMessage({
              message: "saveDemographics",
              gender: gender,
              age: age,
              occupation: occupation,
              occupationDesc: occupationDesc
            },
            function(response) {
              port.postMessage("questionnaire");
              // questionnaireButton.style.display = "block";
              // questionnaireButton.style.visibility = "visible";
            });

        } else {
          document.getElementById("errorMessage").style.display = "block";
        }
      };
    }
  });

  window.browser.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log("MESSAGE", request.msg, request)
      if (request.msg === "updateStatus") {
        var statusHeader = document.getElementById("statusHeader");
        statusHeader.innerHTML = request.data.subject;
        var statusText = document.getElementById("statusText");
        statusText.innerHTML = request.data.content;
        if (request.data.subject == "Success!") {
          document.getElementById("status").classList.add("success");
        } else if (request.data.subject == "Error") {
          document.getElementById("status").classList.add("error");
        } else {
          document.getElementById("status").classList.add("generating");
        }
        return true;
      }
      return true;
    }
  );




  $('input[group=questionnaire]').change(
    function() {
      if (this.checked) {
        window.browser.runtime.sendMessage({
            message: "updateQuestionnaireRating",
            type: $(this).attr('name'),
            rating: this.value
          },
          function(response) {});
      }
    });




  // var feedbackButton = document.getElementById("feedbackButton");
  // feedbackButton.onclick = function() {
  //   var bugReport = document.getElementById("bugReport").value;
  //   var query = {
  //     active: true,
  //     currentWindow: true
  //   };
  //   tab = chrome.tabs.query(query, function(tabs) {
  //     var currentTab = tabs[0]; // there will be only one in this array
  //     sendFeedbackToBackgroundScript(bugReport, currentTab.url);
  //   });
  //   document.getElementById("bugReport").value = "";
  // };








  function sendFeedbackToBackgroundScript(bugReport, url) {

    window.browser.runtime.sendMessage({
        message: "feedback",
        url: url,
        bugReport: bugReport
      },
      function(response) {});
  }

  function callback(tabs) {
    var currentTab = tabs[0]; // there will be only one in this array
    console.log("currentTab", currentTab);
    // also has properties like currentTab.id
    return currentTab;
  }
})();
