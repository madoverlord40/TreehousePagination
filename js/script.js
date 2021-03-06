/*
Treehouse Techdegree:
FSJS Project 2 - Data Pagination and Filtering
*/



/*
For assistance:
   Check out the "Project Resources" section of the Instructions tab: https://teamtreehouse.com/projects/data-pagination-and-filtering#instructions
   Reach out in your Slack community: https://treehouse-fsjs-102.slack.com/app_redirect?channel=unit-2
*/

//global constants
const maxDisplayItems = 9;
//max pages constant used in computing the maximum pages we can have
const maxPage = Math.ceil(data.length / maxDisplayItems) + 1;
//store the student list html element, updated  when buildListElements is called
var studentListHTML = '';
//locally store the list in data.js for better naming
const studentList = data;
//store a search result list, array starts empty.
let searchStudentList = [];

// keep track of the last page changing button clicked
var lastClickedButton = null;
//keep track if we are searching for a student name
let isSearching = false;
//store the search result element so we cant update its content
let searchResultTextContent = null;

//helper function to create new elements
function createNewElement(elementType, className, text, attribute, attributeValue, parentElement) {
   if(elementType != null) {
      let element = document.createElement(elementType);

      if(className != null) {
         element.className = className;
      }

      if(text != null) {
         element.textContent = text;
      }

      if(attribute != null && attributeValue != null) {
         element.setAttribute(attribute, attributeValue);
      }

      if(parentElement != null && typeof(parentElement) === 'object') {
         parentElement.appendChild(element);
      }

      return element;
   }

   return null;
}

 //GOING FOR EXCEEDS

function buildSearchBox() {     
      
   let page = document.querySelector(".page");
   let header = document.querySelector(".header");

   let searchLabelElement = createNewElement("LABEL", "student-search", null,"for", "search", header);

   let inputElement = createNewElement("INPUT", null, null, "id", "search", searchLabelElement);
   inputElement.setAttribute("placeholder", "Search by name...");

   let searchButton = createNewElement("BUTTON", null, null, null, null, searchLabelElement );
   let searchBtnImg = createNewElement("IMG", null, null, "src", "img/icn-search.svg", searchButton);
   searchBtnImg.setAttribute("alt", "Search icon");

   let searchResultText = createNewElement("TEXT", null, "", "id", "text", searchLabelElement);
   searchResultTextContent = searchResultText;

   //click handler
   searchLabelElement.onclick = (eventObject) => {
      searchButtonElementEventHandler(eventObject, this);
   }

   //key up handler
   searchLabelElement.onkeyup  = () => {
      processNameSearch();
   }
    
}

function showNoSearchResults() {

   studentListHTML = document.querySelector('.student-list'); 
   // set the innerHTML property of the variable you just created to an empty string
   studentListHTML.innerHTML = '';

    //the outer list element item
    let studentItem = createNewElement('LI', "student-item cf", null, null, null, null);

    //the div element
    let divElement = createNewElement('DIV', "student-details", null, null, null, studentItem);

    //the H3 element and context set
    let h3Element = createNewElement('H3', null, "No Matching students found!", null, null, divElement);

    //insert above elements into the HTML
    studentListHTML.appendChild(studentItem);
}
//END EXCEEDS

//private function to build HTML list items
function buildListItems(list, start, end) {
   studentListHTML = document.querySelector('.student-list');   
   //lets make sure we grabbed the correct element in the constructor
   if(studentListHTML != null && list != null) {
      //make sure we have valid start and end
      if(start >= 0 && end > start) {
        // set the innerHTML property of the variable you just created to an empty string
        studentListHTML.innerHTML = '';
        // loop over the length of the `list` parameter
        for(var index = 0; index < list.length; index++) {
           // inside the loop create a conditional to display the proper students
           if(index >= start && index < end) {
              // inside the conditional:
              // create the elements needed to display the student information

              //the outer list element item
              let studentItem = createNewElement('LI', "student-item cf", null, null, null, null);

              //the div element
              let divElement = createNewElement('DIV', "student-details", null, null, null, studentItem);

              //the avatar image element
              const image = list[index].picture.large;
              let imgElement = createNewElement('IMG', "avatar", null, "src", `${image}`, divElement);

              //the H3 element and context set
              let h3Element = createNewElement('H3', null, `${list[index].name.first}  ${list[index].name.last}`, null, null, divElement);

              //the span element and context set
              let spanElement = createNewElement('SPAN', "email", `${list[index].email}`, null, null, divElement);
             
              let divJoinElement = createNewElement('DIV', "joined-details", null, null,null, studentItem);

              let spanDateElement = createNewElement('SPAN', "date", `Joined: ${list[index].registered.date}`, null, null, divJoinElement);

              //insert above elements into the HTML
              studentListHTML.appendChild(studentItem);
           }
        }

        return true;
     }
  }
  return false;
}

//private search method for searching for names from the search box
//called from SearchButtonKeyUpHandler and SearchButtonElementEventHandler
function searchFor(searchName) {
   //track how many were found
   let foundCount = 0;

   if(typeof(searchName) === "string" && searchName.length > 0) {
      //declare new array
      searchStudentList = [];
      
      for(var index = 0; index < studentList.length; index++) {
         //get the last name string from the index in list, force the name to lowercase for easy searching
         let name = studentList[index].name.last.toLowerCase();
         
         //check if the name includes the user text
         if(name.includes(searchName)) {
            searchStudentList[foundCount] = studentList[index];
            foundCount++;
         }
      }
   }

   return foundCount;
}

   //function to process the name search box, made public for testing
function processNameSearch() {
   const textField = document.getElementById("search");
      
   if(textField != null) {
      const userText = textField.value.toLowerCase();
      //flag that we are searching
      isSearching = true;

      //lets make sure we have a valid string
      if(userText.length > 0) {
        const result = searchFor(userText);
         //finally, show the new list
         showPage(1);
         addPagination(searchStudentList);

         //if we have no results, show that as the only list item on the screen
         if(result === 0) {            
            showNoSearchResults();
         }
      }
      else {

         //reset the search array
         searchStudentList = studentList;
         //set that we are not searching anymore
         isSearching = false;
         //reset pagination so we get the normal button list
         paginationOnce = false;
         //show the page 
         showPage(1);
         addPagination(searchStudentList);

         console.log("No Names found!");
      }
   }
   else {
      console.log("invalid text field!");
   }
}

//Event handler for the search button
//@Param eventObject, the event object passed down from the framework
function searchButtonElementEventHandler(eventObject) {
   if(eventObject != null && eventObject.target != null) {
      let selectedItem = eventObject.target;
      //sometimes it comes up as the img being clicked so lets respond to that as well, otherwise the user has to click outside the img to hit the button.
      if(selectedItem.nodeName === "IMG" || selectedItem.nodeName === "BUTTON") {
         processNameSearch();
      }
   }
}

//event handler for clicking on the page buttons at the bottom of the web page
//@Param eventObject, the event object passed down from the framework
function buttonItemEventHandler(eventObject) {
   // if the click target is a button:
   if(eventObject.target.nodeName === "BUTTON") {
      // remove the "active" class from the previous button
      if(lastClickedButton != null) {
         lastClickedButton.className = '';
      }

      // add the active class to the clicked button
      lastClickedButton = eventObject.target;
      lastClickedButton.className = "active";

      // call the showPage function passing the page to display as arguments
      const page = parseInt(lastClickedButton.textContent);
      showPage(page);
   }
}

/*
Create the `showPage` function
This function will create and insert/append the elements needed to display a "page" of nine students
@Param page: the current page we are show, if items are greater than 9
*/
function showPage(page) {
   //lets make sure we get valid data before processing
   if(page > 0 && page <= maxPage) {
      // create two variables which will represent the index for the first and last student on the page
      let startIndex = ((page * maxDisplayItems) - maxDisplayItems);
      let endIndex = (page * maxDisplayItems);

      //update the page with the search list if we are searching
      let newList = (isSearching ? searchStudentList : studentList);

      //call the build items function
      let result = buildListItems(newList, startIndex, endIndex);

      if(result === false) {
         console.log("Failed to create list items.");
      }
   }
}

/*
Create the `addPagination` function
This function will create and insert/append the elements needed for the pagination buttons
@Param list: the array to use when computing the paging buttons, how many
*/
function addPagination(list) {

   //lets make sure the list is valid before processing it
   if(list != null) {

      // create a variable to calculate the number of pages needed
      const numOfPages = Math.ceil(list.length / maxDisplayItems);

      // select the element with a class of `link-list` and assign it to a variable
      let linkList = document.querySelector(".link-list");

      // set the innerHTML property of the variable you just created to an empty string
      linkList.innerHTML = '';

      // loop over the number of pages needed
      for(var index = 0; index < numOfPages; index++) {

         // create the elements needed to display the pagination button
         let listItem = document.createElement("LI");
         
         //create the button element
         let button = document.createElement("BUTTON");
         button.textContent = `${index + 1}`;

         // give the first pagination button a class of "active"
         if(index == 0) {
            button.className = "active";
            lastClickedButton = button;
         }

         // insert the above elements
         listItem.appendChild(button);
         linkList.appendChild(listItem);
      }

      // create an event listener on the `link-list` element
      linkList.onclick = (eventObject) => {
         buttonItemEventHandler(eventObject);
      }

   } else {
      console.log("Pagination failed: the list parameter is null!");
   }
}


// Call functions
buildSearchBox();
showPage(1);
addPagination(studentList);
