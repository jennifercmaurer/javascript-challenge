/*
    Signup Form Script
    This script will load the state select list and validate the form before submission
*/
document.addEventListener('DOMContentLoaded', onReady()); //after loaded

function onReady() {
	var form = document.getElementById("signup");

	//adds all states options to drop down
	var states = document.getElementById("signup").elements["state"]; //connects to html file
	for (var i = 0; i < usStates.length; i++) { //for each item of array usStates
		var option = document.createElement("OPTION");  //create option
		var name = usStates[i].name; //save the name for item
		var code = usStates[i].code; //save code for item
		option.text = name; //save text of option as name
		option.value = code; //save value of option as code
		states.appendChild(option); // connect option to states in html
	}

	//for occupation, if select "other", add text option
	var occupation = document.getElementById("signup").elements["occupation"];//connects to html file
	document.addEventListener("change", function() { //on event "change" do this function:
		var text = document.getElementById("signup").elements["occupationOther"]; //save occupationOther input as text
		if (occupation.value === "other") { //if other is chosen
			text.style.display = "block"; //change the display to block
		}
		else {
			text.style.display = "none"; //otherwise keep display none (disabled textbox)
		}
	});

	//when click submit, do onSubmit function
 	form.addEventListener("submit", onSubmit);

	//when click no thanks button, if sure--> move to google; nothing otherwise
	var cancelButton = document.getElementById("cancelButton"); //save/connect cancel button from html
	cancelButton.addEventListener("click", function() { //on event click to this function: 
		if (confirm("Are you sure?")) { //if you say you're sure
			location.assign("http://google.com"); //relocate to google
		} 
	});
}

//when submit, preventDefault/moving to other page if invalid form
function onSubmit(evt) {
	try {
    	evt.returnValue = validateForm(this); //evt.returnValue = true if form is valid
    }
    catch(err) {
    	console.log(err);
    	evt.returnValue = false;
    }
    if (!evt.returnValue) { //if invalid form
        evt.preventDefault();
 	}
    return evt.returnValue;
}

/* This function validates the form's information;
returns true if the form is valid or false if the form is invalid.
It will also let the user know which fields are invalid.
parameters: form=reference to the form that needs to be validated */
function validateForm(form) {
    var requiredFields = ['firstName', 'lastName', 'address1', 'city', 'state', 'zip', 'birthdate'];
	if (form.elements['occupation'].value === 'other') { //if other is selected
    	requiredFields.push('occupationOther');
    }
    var idx;
    var formValid = true;
    for (idx = 0; idx < requiredFields.length; ++idx) {
    	formValid &= validateRequiredField(form.elements[requiredFields[idx]]); //formValid is true if all fields are valid
    }
    return formValid;
}


//event listener on click; prevent default action unless valid
/* This function validates a field that is required. If the field does not have a value, or has only spaces,
* it will mark the field as invalid and return false. Otherwise it will return true.  */
function validateRequiredField(field) {
	var value = field.value.trim();
	var valid = value.length > 0; //true if not blank
	if (valid) { //if not blank
		field.className = 'form-control';
		var zipRegExp = new RegExp('^\\d{5}$');
		if (field.name == 'zip' && !zipRegExp.test(value)) { //if zip is not 5 digits
			valid = false;
		} else if (field.name == 'birthdate') { //for birthday, check if older than 13 years
			birthday = moment(document.getElementById("signup").elements.birthdate.value);
			var age = moment().diff(birthday, 'years');
			if (age < 13) {//change from milliseconds
				field.className = 'form-control invalid-field';
				document.getElementById("birthdateMessage").innerHTML = "You are not at least 13 years old!";
				valid = false;
			} else {
				document.getElementById("birthdateMessage").innerHTML = "";
				valid = true;		
			}
		}
	}
	field.className = 'form-control' + (valid ? '': ' invalid-field'); //confirm, if field is valid; if not, make invalid
	return valid;
}