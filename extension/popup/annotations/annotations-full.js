/*jshint esversion: 6 */
window.browser = (function() {
  return window.msBrowser || chrome;
})();

let categoriesToExplanaitionMap = new Map();
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
categoriesToExplanaitionMap.set("User Choice/Control", "This category describes general choices and control options available to users.");
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
categoriesToExplanaitionMap.set("User with account", "This attribute describes if the practice specifically applies to users with an account or who are registered with the website.");
categoriesToExplanaitionMap.set("Financial", "This attribute describes financial information, like credit/debit card data, other payment information, credit scores, and so on.");
categoriesToExplanaitionMap.set("Location", "This attribute describes geo-location information (e.g., user's current location) regardless of granularity, i.e., it could be the exact location, the ZIP code, or the city.");
categoriesToExplanaitionMap.set("Advertising", "This attribute describes whether collected information is used to show ads that are either targeted to the specific user or not targeted.");

window.onload = function getCurrentAnnotationFromStorage(request) {
  window.browser.storage.local.get(["currentAnnotation"], function(result) {
    console.log(result);
    document.getElementsByClassName("uk-accordion-title")[0].innerHTML = `All Predictions for: ${result.currentAnnotation.baseUrl}`;
    var table = document.getElementById("annotationsTable");
    var tableEntrySentences = result.currentAnnotation.data.data[1];
    var tableEntryPredictions = {};
    for (var entry of result.currentAnnotation.data.data[0][0][1]) {
      var listPredictionsMain = document.createElement("ul");
      listPredictionsMain.classList.add("uk-list", "uk-list-divider");
      for (var i = 1; i < entry.length; i++) {
        var predictionPair = entry[i];
        // predictionText = predictionText + `${predictionPair[0][1]} (${predictionPair[1]}); `;
        var listPredictionsListElementMain = document.createElement("li");
        listPredictionsListElementMain.innerHTML = `${predictionPair[0][1]} (${predictionPair[1]})`;

        var questionMarkMainContent = document.createElement("i");
        questionMarkMainContent.classList.add("far", "fa-question-circle");
        var tooltipMainWithContent = document.createElement("div");
        tooltipMainWithContent.setAttribute("style", "display: inline-block;");
        tooltipMainWithContent.setAttribute("uk-tooltip", `title: ${categoriesToExplanaitionMap.get(predictionPair[0][1])}`);
        tooltipMainWithContent.appendChild(questionMarkMainContent);
        listPredictionsListElementMain.appendChild(tooltipMainWithContent);

        var checkBoxMainLabel = document.createElement("label");
        checkBoxMainLabel.innerHTML = "Prediction wrong?";
        var checkBoxMain = document.createElement("input");
        checkBoxMain.setAttribute("name", "assessmentBox");
        checkBoxMain.setAttribute("isMain", true);
        checkBoxMain.setAttribute("prediction", `${predictionPair[0][1]}`);
        checkBoxMain.setAttribute("probability",`${predictionPair[1]}`);
        checkBoxMain.classList.add("uk-checkbox");
        checkBoxMain.setAttribute("type", "checkbox");
        checkBoxMainLabel.appendChild(checkBoxMain);
        listPredictionsListElementMain.appendChild(checkBoxMainLabel);
        listPredictionsMain.appendChild(listPredictionsListElementMain);
      }
      tableEntryPredictions[entry[0]] = listPredictionsMain;
    }
    var collectionOfULAttr = {};
    for (var entryAttr of result.currentAnnotation.data.data[0][1][1]) {
      var listPredictionsAttr = document.createElement("ul");
      listPredictionsAttr.classList.add("uk-list", "uk-list-divider");
      for (var y = 1; y < entryAttr.length; y++) {
        var predictionPairAttr = entryAttr[y];
        var listPredictionsListElementAttr = document.createElement("li");
        listPredictionsListElementAttr.innerHTML = `${predictionPairAttr[0][0]}: ${predictionPairAttr[0][1]} (${predictionPairAttr[1]})`;

        var questionMarkAttrContent = document.createElement("i");
        questionMarkAttrContent.classList.add("far", "fa-question-circle");
        var tooltipAttrWithContent = document.createElement("div");
        tooltipAttrWithContent.setAttribute("style", "display: inline-block;");
        tooltipAttrWithContent.setAttribute("uk-tooltip", `title: ${categoriesToExplanaitionMap.get(predictionPairAttr[0][0])}`);
        tooltipAttrWithContent.appendChild(questionMarkAttrContent);
        listPredictionsListElementAttr.appendChild(tooltipAttrWithContent);


        var checkBoxAttrLabel = document.createElement("label");
        checkBoxAttrLabel.innerHTML = "Prediction wrong?";
        var checkBoxAttr = document.createElement("input");
        checkBoxAttr.setAttribute("name", "assessmentBox");
        checkBoxAttr.setAttribute("isMain", false);
        checkBoxAttr.setAttribute("prediction", `${predictionPairAttr[0][0]}: ${predictionPairAttr[0][1]}`);
        checkBoxAttr.setAttribute("probability", `${predictionPairAttr[1]}`);
        checkBoxAttr.classList.add("uk-checkbox");
        checkBoxAttr.setAttribute("type", "checkbox");
        checkBoxAttrLabel.appendChild(checkBoxAttr);
        listPredictionsListElementAttr.appendChild(checkBoxAttrLabel);
        listPredictionsAttr.appendChild(listPredictionsListElementAttr);
      }
      collectionOfULAttr[entryAttr[0]] = listPredictionsAttr;
    }



    for (entry in tableEntrySentences) {
      var tableRow = document.createElement("tr");
      var tableEntrySentence = document.createElement("td");
      var tableEntryPrediction = document.createElement("td");
      var tableEntryPredictionAttributes = document.createElement("td");
      tableEntrySentence.innerHTML = tableEntrySentences[entry];
      if (tableEntryPredictions[entry] !== undefined) {
        tableEntryPrediction.appendChild(tableEntryPredictions[entry]);
      } else {
        tableEntryPrediction.innerHTML = "No prediction available";
        var questionMarkMain = document.createElement("i");
        questionMarkMain.classList.add("far", "fa-question-circle");
        var tooltipMain = document.createElement("div");
        tooltipMain.setAttribute("style", "display: inline-block;");
        tooltipMain.setAttribute("uk-tooltip", "title: This means that no main category could be predicted with a probability over 50%");
        tooltipMain.appendChild(questionMarkMain);
        tableEntryPrediction.appendChild(tooltipMain);
      }

      if (collectionOfULAttr[entry] !== undefined) {
        tableEntryPredictionAttributes.appendChild(collectionOfULAttr[entry]);
      } else {
        tableEntryPredictionAttributes.innerHTML = "No prediction available";
        var questionMark = document.createElement("i");
        questionMark.classList.add("far", "fa-question-circle");
        var tooltip = document.createElement("div");
        tooltip.setAttribute("style", "display: inline-block;");
        tooltip.setAttribute("uk-tooltip", "title: If the predicted main category is \"Introductory/Generic\", \"International and Specific Audiences\", or \"Privacy contact information\" there is no prediction, because those categories do not have attributes. Otherweise, this means that no attribute could be predicted with a probability over 50%");
        tooltip.appendChild(questionMark);
        tableEntryPredictionAttributes.appendChild(tooltip);
      }

      tableRow.appendChild(tableEntrySentence);
      tableRow.appendChild(tableEntryPrediction);
      tableRow.appendChild(tableEntryPredictionAttributes);
      table.appendChild(tableRow);
    }
  });

  var button = document.getElementById("send");
      var entries = [];
  button.onclick = function() {
    var checkedBoxes = document.querySelectorAll('input[name=assessmentBox]');

    for (var checkbox of checkedBoxes) {
      console.log(checkbox)
        var data = {};
        data["assessment"] = checkbox.checked;
        data["sentence"] = checkbox.closest('tr').firstChild.innerHTML;
        data["isMainPrediction"] = checkbox.getAttribute("ismain");
        data["prediction"] = checkbox.getAttribute("prediction");
        data["probability"] = checkbox.getAttribute("probability");
        entries.push(data);
    }
    console.log("DATA", JSON.stringify(entries));
  };
};
