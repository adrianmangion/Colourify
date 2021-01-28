var baseColourHex;
var loggedInUser;

// Onload invoke generateColours function
window.onload = intiliaze;

function intiliaze(){

    // Check if session is active
    $.get(`/checksession`, (data) => {

        if(data){
            generateColours();
            userFunctionality();
        }
        // If active, start full user experience
        else{
            generateColours();
        }
        // Else start normal user experience
    });
}

/******************** Generates 4 random colours to panel ********************/
function generateColours(){
    
    for(let i = 1; i <= 4; i++)
    {
        let randomColour = tinycolor.random();
        // let colour = tinycolor(randomColour);
        $("#colour" + i).css("background", randomColour);
        $("#pc" + i).css("background", randomColour);

        //Change change input and button colour according to colour brightness
        if(randomColour.isLight()){
            $("#colour"+i).css("color", "#333333");
            $("#colour"+i).find(".hex-text").css("color", "#333333");
            $("#colour"+i).find(".hex-text").val(randomColour.toHexString());
        }

        else if(randomColour.isDark()){
            $("#colour"+i).css("color", "whitesmoke");
            $("#colour"+i).find(".hex-text").css("color", "whitesmoke");
            $("#colour"+i).find(".hex-text").val(randomColour.toHexString());
        }
    }
} 

/******************** Newly Created Divs' Change Colour ********************/
function changeColour(e){

    // 1. Grab colour of clicked div.
    let selectedColour = e.currentTarget.style.backgroundColor;
    selectedColour = tinycolor(selectedColour);
    let colourHex = selectedColour.toString("hex6");

    // 2. Grab id of clicked div.
    let id = e.currentTarget.id;
    let colourID = e.currentTarget.parentNode.parentNode.id.substring(6);

    // 3. Set newly selected colour as background of colour panel.
    $("#" + id).parent().parent().css("background", selectedColour);                        // Grandparent = .colour
    $("#pc" + colourID).css("background", selectedColour);

    // 4. Display previously removed elements.                                              // Parent      = .alt-shades-div
    $("#" + id).parent().siblings().css("display", "");                                     // Siblings    = .colour-buttons, .colour-hex, .base-colour
    $("#" + id).parent().parent().find(".colour-buttons").children().css("display", "");    // Children    = .alternative-shades, .options-div 

    // 5. Change hex-text input field to match selectedColour.
    $("#" + id).parent().siblings().find(".hex-text").val(colourHex);

    if(selectedColour.isDark()){
        $("#" + id).parent().parent().css("color", "whitesmoke");
        $("#" + id).parent().siblings().find(".hex-text").css("color", "whitesmoke");
    }

    else if(selectedColour.isLight()){
        $("#" + id).parent().parent().css("color", "#333333");
        $("#" + id).parent().siblings().find(".hex-text").css("color", "#333333");
    }

    // 6. Remove all alternative shades.
    $("#" + id).parent().children().remove();
}

/******************** Change Colours Of Panels Through Spacebar Event ********************/
$('body').keyup(function(e){
    // 1. Check if key pressed is a spacebar
    if(e.keyCode == 32 && !($(".call-to-action input").is(":focus"))){
        // 2. Invoke generateColours() method 
        generateColours();
    }
});

/******************** Alternative Shades Click Event Handler ********************/
$(".apps-sharp").click(function() {
    //Variables
    let lightShades = new Array(10);
    let darkShades = new Array(10);
    let lightIndex = 9;
    let darkIndex = 12;
    let id = $(this).parent().parent().parent().attr('id');   /* Store the colour (great grand parent)'s ID */
    let height = $(this).parent().parent().parent().height(); /* Store the height of the colour panel       */
    let shadeHeight = height/(21);
    let tempColour, isDark;

    // 1. Grab colour of current background.
    let colour = $(this).parent().parent().parent().css("background-color");
    colour = tinycolor(colour).toHexString();

    // 2. Create a tinycolor object.
    let tinycolour = tinycolor(colour);
    tempColour = tinycolour;

    // 3. Store isDark variable (Boolean)
    isDark = tinycolour.isDark();

    // 4. Get the brightness of colour.
    let brightness = tinycolour.getBrightness();

    // 5. Round brightness to nearest integer.
    brightness = Math.round(brightness);

    // 6. Iterate 10 times and brighten the colour by 5 each time.
    for(let i = 0; i < lightShades.length; i++){
        lightShades[i] = tempColour.brighten(5).toString("hex6");
        tempColour = tinycolor(lightShades[i]);
    }

        // 6.1. Reset tempColour.
        tempColour = tinycolour;

        // 6.2. Iterate 10 times and darken the colour by 5 each time.
        for(let i = 0; i < darkShades.length; i++){
            darkShades[i] = tempColour.darken(5).toString("hex6");
            tempColour = tinycolor(darkShades[i]);
        }

    // 7. Create 10 divs (one for each element in lightShades[]).
    for(let i = 1; i <= lightShades.length; i++){

        // 7.1. Append light shade divs.
        jQuery('<div/>', {
            class: 'alt-shading', 
            id: i,
            height: shadeHeight
        }).appendTo($(this).parent().parent().parent().find(".alt-shades-div"));

        // 7.2. Add background colour
        $("#" + i).css("transition", "background 0.2s ease");
        $("#" + i).css("background", lightShades[lightIndex]);

        // 7.3. Add <p> tag with hex code.
        $("#" + i).append("<p id='"+ lightShades[lightIndex]+ "Text"+ "'>" + lightShades[lightIndex] + "</p>");

        // 7.4. Add CSS to newly added <p> tag.
        $("#" + i).children().css({
            "position" : "absolute",
            "visibility" : "hidden",
            "text-transform" : "uppercase",
            "margin-left" : "10em",
            "color" : "#1e1e1e",
            "opacity" : "0.9",
            "font-size" : "20",
            "letter-spacing" : ".06em"
        });

        // 7.5 Add CSS to hover listener.
        $("#" + i).hover(function(){
            $(this).children().css("visibility", "visible");
        });

        // 7.6 Add CSS to mouseout listener
        $("#" + i).mouseout(function(){
            $(this).children().css("visibility", "hidden");
        });

        // 7.7 Add CSS to hover of <p> tag
        $("#" + i).children().hover(function(){
            $(this).css("visibility", "visible");
        });

        // 7.8 Set click event for each div.
        $("#" + i).click(function(e){
            changeColour(e);
        });

        // 7.9 Create a tinycolor object
        let loopColour = tinycolor(lightShades[lightIndex]);

        // 7.10 Check if colour of current iteration is bright.
        if(loopColour.isDark()){
            $("#"+i).css("color","#b0b3b8");
        } 

        // 7.11 Decremenet index.
        lightIndex--;
    }

    // 8. Create current colour division.
    jQuery('<div/>', {
        id: 'currentColour'+id,
        height: shadeHeight,
    }).appendTo($(this).parent().parent().parent().find(".alt-shades-div"));

        // 8.0 Add background colour.
        $("#currentColour"+ id).css("background", colour);

        // 8.1. Add <p> tag with hex code.
        $("#currentColour"+id).append("<span id='currentColourPoint"+ id +"'></span><p id='currentColourText" + id + "'>" + colour.toString("hex6") + "</p>");

        // 8.2. Add CSS to newly added <p> tag
        $("#currentColourText" + id).css({
            "position" : "absolute",
            "visibility" : "hidden",
            "text-transform" : "uppercase",
            "margin-left" : "10em",
            "color" : "#1e1e1e",
            "opacity" : "0.9",
            "font-size" : "20",
            "letter-spacing" : ".06em"
        });

        // 8.3. Add CSS to newly added <span> tag
        $("#currentColourPoint" + id).css({
            "position" : "absolute",
            "text-align" : "left",
            "margin-left" : "-10em",
            "margin-top" : "1.2em",
            "background" : "#333",
            "opacity" : "1",
            "width" : "12px",
            "height" : "12px",
            "border-radius" : "10px"
        });

        // 8.4. Add CSS to hover listener.
        $("#currentColour" + id).hover(function(){
            $("#currentColourText" + id).css("visibility", "visible");
        });

        // 8.5. Add CSS to mouseout listener
        $("#currentColour" + id).mouseout(function(){
            $("#currentColourText" + id).css("visibility", "hidden");
        });

        // 8.6. Add CSS to hover of <p> tag
        $("#currentColourText" + id).hover(function(){
            $(this).css("visibility", "visible");
        });

        // 8.7. Set click event for each div.
        $("#currentColour" + id).click(function(e){
            changeColour(e);
        });

        // 8.8 Check if colour of current color is bright.
        if(tinycolor(colour).isDark()){
            $("#currentColourText").css("color","#b0b3b8");
        } 

    // 9. Create 10 divisions for dark shades.
    for(let i = 0; i < darkShades.length; i++){
        // 9.1. Append dark shade divs.
        jQuery('<div/>', {
            class: 'alt-shading',
            id: darkIndex,
            height: shadeHeight,
        }).appendTo($(this).parent().parent().parent().find(".alt-shades-div"));

        // 9.2. Add background colour.
        $("#"+darkIndex).css("background", darkShades[i]);

        // 9.3. Add <p> tag with hex code.
        $("#"+darkIndex).append("<p id='"+ darkShades[i]+ "Text"+ "'>" + darkShades[i] + "</p>");
        
        // 9.4. Add CSS to newly added <p> tag.
        $("#" + darkIndex).children().css({
            "position" : "absolute",
            "visibility" : "hidden",
            "text-transform" : "uppercase",
            "margin-left" : "10em",
            "color" : "#b0b3b8",
            "opacity" : "0.9",
            "font-size" : "20",
            "letter-spacing" : ".06em"
        });

        // 9.5. Add CSS to hover listener.
        $("#" + darkIndex).hover(function(){
            $(this).children().css("visibility", "visible");
        });

        // 9.6. Add CSS to mouseout listener
        $("#" + darkIndex).mouseout(function(){
            $(this).children().css("visibility", "hidden");
        });

        // 9.7. Add CSS to hover of <p> tag
        $("#" + darkIndex).children().hover(function(){
            $(this).css("visibility", "visible");
        });

        // 9.8 Set click event for each div.
        $("#" + darkIndex).click(function(e){
            changeColour(e);
        });

        // 9.9 Create a tinycolor object
        let loopColour = tinycolor(darkShades[darkIndex]);

        // 9.10 Check if colour of current color is bright.
        if(!loopColour.isDark()){
            $("#currentColourText").css("color","#1e1e1e");
        } 

        // 9.11 Increment index.
        darkIndex++;
    }

    // 10. Set colour panel buttons display to none.
    $(this).parent().css("display", "none");                                                // Parent           = .alternative-shades
    $(this).parent().siblings().css("display", "none");                                     // Parent Siblings  = .options-div
    $(this).parent().parent().parent().find(".colour-hex").css("display", "none");          // Greatgrandparent = .colour
    $(this).parent().parent().parent().find(".base-colour").css("display", "none");

});

/******************** Base Colour Selector Click Event Handling ********************/
$(".base-colour").click(function(){

    // Check if there is a base colour already selected
    if($("#currentBase").length != 0) {     
        // If there is, then change the css accordingly
        $("#currentBase").css({
            "visibility" : "",
            "opacity" : ""
        });
        $("#currentBase").parent().find(".bc")[0].innerHTML = "Set as base colour";
        $("#currentBase").removeAttr("id");
      }
    
    baseColourHex = $(this).parent()[0].style.backgroundColor;
    baseColourHex = tinycolor(baseColourHex).toString("hex6");
    
    // Make the .base-colour marker permanently visible
    $(this).css({
        "visibility" : "visible",
        "opacity" : "1"
    });

    // Add id attribute
    $(this).attr("id", "currentBase");

    // Change text of tooltip
    $(this).parent().find(".bc")[0].innerHTML = "Current base colour";


});

/* Colour Hex Text-Changed Event Handler */
$(".hex-text").keypress(function(e) {

    // 1. Check which key is pressed.
    let charCode = !e.charCode ? e.which : e.charCode;
    
    // 2. Grab id of the colour being changed
    let colourID = e.currentTarget.parentNode.parentNode.attributes.id.value;
    colourID = colourID.substring(6);
    
    /*  If it's an allowed character, then allow input.
        Allowed characters:
        1. (35 = hashtag #)
        2. (48 = digit 0, 57 = digit 9)
        3. (65 = uppercase A, 70 = uppercase F)
        4. (97 = lowercase a, 102 = lowercase f) */

    if((charCode == 35) || (charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 70) || (charCode >= 97 && charCode <= 102)){

        //Set currentHex value and change background-color of colour panel.
        let currentHex = $(this).val();
        let colour = tinycolor(currentHex);
        $(this).parent().parent().css("background-color", colour);                      // Grandparent = .colour
        $("#pc"+colourID).css("background", colour);
        

        //Change input and button colour according to colour brightness
        if(colour.isLight()){
            $(this).parent().parent().css("color", "#333333");
        } 

        else if(colour.isDark()){
            $(this).parent().parent().css("color", "whitesmoke");
        }
    }

    //Otherwise if not an allowed character, disallow input.
    else{
        e.preventDefault();
    }

});

/********************  Login/Registration Modal Handling *************************/
// Register Button Click Event Handler
$(".register-btn").click(function(){

    // 1. Set-up innerHTML of Registration Modal.
    let registerStr =
    "<div class='modal-close'>" +
    "<ion-icon id='modalCloseBtn' name='close-circle-outline'></ion-icon>" +
    "</div>" +
    "<div class='brand-header'>" +
    "<h2 class='brand-text'>Colour<span class='accent'>ify</span></h2>" +
    "</div>" +
    "<div class='modal'>" +
    "<h3 class='modal-header'>Register</h3>" +
    "<form class='modal-form'>" +
        "<span class='form-text'>Email address</span>" +
        "<input name='email' type='email' id='Email' class='form-inputbox'>" +

        "<span class='form-text'>Username</span>" +
        "<input name='text' type='text' id='username' class='form-inputbox'>" +

        "<span class='form-text'>Password</span>" +
        "<input name='password' type='password' id='Password' class='form-inputbox'>" +

        "<span class='form-text'>Confirm Password</span>" +
        "<input name='confirmPass' type='password' id='ConfirmPass' class='form-inputbox'>" +

        "<input type='submit' value='Submit' class='btn login-btn' id='register'>" +
    "</form>" +
    "<span id='errormsg'></span>" +
    "<div class='seperation'>" +
        "<div class='seperator'></div>" +
        "<span class='or'>Or</span>" +
        "<div class='seperator'></div>" +
    "</div>" +
    "<a class='btn' id='fbLogin'><ion-icon class='socialmedia-icon' name='logo-facebook'></ion-icon><p>Continue with Facebook</p></a>" +
    "<a class='btn' id='googleLogin'><ion-icon class='socialmedia-icon' name='logo-google'></ion-icon><p>Continue with Google</p></a>" +
    "</div>";

    // 2. Set innerHTML equal to prepared string.
    $("#modalBackground")[0].innerHTML = registerStr;

    // 3. Show modal.
    $("#modalBackground").css({
        "display" : "block"
    });

    // 4. Set close event handler.
    $("#modalCloseBtn").click(function(){
        $("#modalBackground").css("display", "none");
    });

    // 5. Registration
    $("#register").click(function() {
        register($(this));
    });
});
// Login Button Click Event Handler.
$(".login-btn").click(function(){
    // 1. Set-up innerHTML of Login Modal.
    let loginStr =
    "<div class='modal-close'>" +
    "<ion-icon id='modalCloseBtn' name='close-circle-outline'></ion-icon>" +
    "</div>" +
    "<div class='brand-header'>" +
    "<h2 class='brand-text'>Colour<span class='accent'>ify</span></h2>" +
    "</div>" +
    "<div class='modal'>" +
    "<h3 class='modal-header'>Sign in</h3>" +
    "<p class='sub-header'>New User?" +
    "<span class='register-btn' id='newUserInstructions'> Create an account.</span>" +
    "</p>" +
    "<form class='modal-form'>" +
        "<span class='form-text'>Email address</span>" +
        "<input id='emailInput' name='email' type='email' class='form-inputbox' required>" +

        "<span class='form-text'>Password</span>" +
        "<input id='passInput' name='password' type='password' class='form-inputbox' required>" +

        "<input type='button' value='Submit' id='login' class='btn login-btn'>" +
    "</form>" +
    "<span id='errormsg'></span>" +
    "<div class='seperation'>" +
        "<div class='seperator'></div>" +
        "<span class='or'>Or</span>" +
        "<div class='seperator'></div>" +
    "</div>" +
    "<a class='btn' id='fbLogin'><ion-icon class='socialmedia-icon' name='logo-facebook'></ion-icon><p>Continue with Facebook</p></a>" +
    "<a class='btn' id='googleLogin'><ion-icon class='socialmedia-icon' name='logo-google'></ion-icon><p>Continue with Google</p></a>" +
    "</div>";

    // 2. Set innerHTML equal to prepared string.
    $("#modalBackground")[0].innerHTML = loginStr;

    // 3. Show modal.
    $("#modalBackground").css({
        "display" : "block"
    });

    // 4. Set close event handler.
    $("#modalCloseBtn").click(function(){
        $("#modalBackground").css("display", "none");
    });

    // 5. Login
    $("#login").click(function() {
        login($(this).parent());
    });
});
// Close button Click Event Handler.
$("#modalCloseBtn").click(function(){
    $("#modalBackground").css("display", "none");
});

/******************** Adjust Button ********************/
$(".options").click(function(){

    // Variables. 
    let visibility = $(this).parent().find(".adjust-panel")[0].style.visibility; //Use this to determine next step.

    // If adjust modal is visible, then hide it upon click.
    if(visibility === "visible")
    {
        $(this).parent().find(".adjust-panel").css("visibility", "hidden");
        $(this).css("visibility", "");
        return;
    }   
    
    // Else, grab colour of panel.
    let colour = $(this).parent().parent().parent()[0].style.backgroundColor;
    colour = tinycolor(colour).toHsv();

    // Set hue, saturation and value.
    let hue = Math.round(colour.h);
    let saturation = colour.s;
    let value = colour.v;    
    
    // Grab the hue's fully saturated and 50% lightness colour (which is used for linear gradient).
    let newColour = tinycolor("hsv("+hue+", 100%, 100%)");
    let hexCode = newColour.toString("hex6");

    // Set inner panel linear gradient
    $(this).parent().find(".inner-panel").css("background" , "linear-gradient(to right,#fff 0%,"+ hexCode +" 100%");
    console.log(saturation);
    console.log(value);

    // Set the graph slider's position according to saturation and value.
    $(this).parent().find(".graph-slider").range2DSlider({
        axis: [[0,1],[0,1]],
        height:      "100%",
        background:  "transparent",
        tooltip:     false,
        grid:        false,
        legend:      false,
        showRanges:  false,
        projections: false,
        showLegend:  [false, false],
        allowAxisMove: ['both']
    }).range2DSlider('value', [saturation,value]);

    // Set change event handler for graph's slider. This changes the background of the #colour.
    $(this).parent().find(".graph-slider").change(function(){
        let coordinates = $(this).parent().find(".graph-slider")[0].value;
        let newHue = $(this).parent().parent().find(".slider")[0].value;
        coordinates = coordinates.split("|");

        let newColour = tinycolor("hsv("+ newHue +"," + coordinates[0] + "," + coordinates[1] +")");
        $(this).parent().parent().parent().parent().parent().css("background", newColour.toHexString());
    });

    // Set the value of the hue slider.
    $(this).parent().find(".slider")[0].value = hue;

    // Set event handler for hue slider.
    $("input[type=range]").on("input", function(){
        $(this).trigger("change");
        // Grab value of slider and store in hue.
        let newHue = $(this)[0].value;

        // Grab saturation and value values from graph
        let coordinates = $(this).parent().parent().find(".graph-slider")[0].value;
        coordinates = coordinates.split("|");

        // Create new colour 
        let newColour = tinycolor("hsl("+newHue+", 100%, 50%)");
        hexCode = newColour.toHexString();

        // Set the .inner-panel background accordingly
        $(this).parent().parent().find(".inner-panel").css("background" , "linear-gradient(to right,#fff 0%,"+ hexCode +" 100%");

        // Change #colour background colour
        let newColourBg = tinycolor("hsv("+ newHue +"," + coordinates[0] + "," + coordinates[1] +")");
        $(this).parent().parent().parent().parent().parent().css("background",newColourBg.toHexString());
    });

    $(this).parent().find(".adjust-panel").css("visibility", "visible");
    $(this).css("visibility", "visible");
});

/******************** Tooltip Event Handlers *****************/
$(".apps-sharp").hover(function() {
    $(this).siblings().css("visibility" , "visible");
});
$(".apps-sharp").mouseout(function() {
    $(this).siblings().css("visibility" , "hidden");
});
$(".options").hover(function() {
    $(this).parent().find(".tooltip").css("margin-left" , "-1.7em");
    $(this).parent().find(".tooltip").css("visibility" , "visible");
});
$(".options").mouseout(function() {
    $(this).parent().find(".tooltip").css("visibility" , "hidden");
});
$(".menu-item-button").hover(function() {
    $(this).siblings().css("visibility" , "visible");
});
$(".menu-item-button").mouseout(function() {
    $(this).siblings().css("visibility" , "hidden");
});
$(".base-colour").hover(function() {
    $(this).parent().find(".bc").css({
        "margin-top" : "0.8em",
        "margin-left"  : "2em",
        "visibility" : "visible"
    });
});
$(".base-colour").mouseout(function() {
    $(this).parent().find(".bc").css("visibility" , "hidden");
});
function addTooltipEvent(element){
    $(element).hover(function() {
        $(this).siblings().css("visibility", "visible");
    });
    $(element).mouseout(function(){
        $(this).siblings().css("visibility", "hidden");
    });
}

/******************** Create Section ********************/
$("#create").click(function(){

    // 1. Add #createMenu
    $("#createMenu").css("display", "block");

    // 2. Add #CenterPanel
    $("#CenterPanel").css("display", "flex");
    

    // 3. Rearrange #LeftPanel
    $("#LeftPanel").css({
        "grid-row-start" : "",
        "grid-column-start" : "",
        "grid-column-end" : ""
    });

    // 4. Reset container's column template
    $(".container").css("grid-template-columns", "349px auto");

    // 5. Remove unneccecesary sections
    $("#exploreSection").remove();
    $("#profileSection").remove();
});

/******************** Explore Section ********************/
$("#explore").click(function(){
    // Populate results from db
    // Put results in grid

    // Set newScene( )
    newScene("#exploreSection");
    
    // 6. Get result set from db through ajax.
    $.get(`/explore`, (data) => {
        let palettes = JSON.parse(data);
        
        for(let i = 0; i < palettes.length; i++){

            // Add a .palette-card to #exploreSection.
            $("#exploreSection").append("<div class='palette-card' id='paletteCard"+i+"'></div>");

            // Add the .created-palette to the .palette-card.
            jQuery('<div/>', {
                class: 'created-palette',
                id: "createdPalette" + i
            }).appendTo($("#paletteCard"+i));

            // Store colours inside an array.
            let colours = new Array(palettes[i].colour1, palettes[i].colour2, palettes[i].colour3, palettes[i].colour4);

            // Add filter to palette.
            $("#createdPalette"+i).append("<div class='cp-filter'></div>");

            // Add colours to .palette-card.
            for(let j = 0; j < 4; j++){
                $("#createdPalette"+i).append("<div class='cp-colour' style='background:"+colours[j]+"'</div>");
            }

            // Add card-info to .palette-card.
            $("#paletteCard"+ i).append(
                "<div class='card-info'>"           +
                "Palette name: "                    + palettes[i].paletteName     +         "<br>" +
                "Created by <span class='accent-card'>" + palettes[i].creatorUsername + "</span> <br>" +
                "<ion-icon class='save-btn' name='heart-outline'></ion-icon>"     +
                "<span class='card-tooltip'>Save</span>"                      +
                "<ion-icon class='view-btn' name='eye-outline'></ion-icon>"       +
                "<span class='card-tooltip'>View</span></div>");   
        }

        // Display #exploreSection
        $("#exploreSection").css("display", "flex");

        // Add tooltip event handler
        $(".save-btn, .view-btn").hover(function() {
            $(this)[0].nextSibling.style.visibility = "visible";
        });

        $(".save-btn, .view-btn").mouseout(function() {
            $(this)[0].nextSibling.style.visibility = "hidden";
        });
    });

    // 7. For each tuple in db, create a div like currentPalette and append to #exploreSection

    // 8. Add event handlers for each button on each palette - View/Save
});


/******************** Login/Register ********************/
// Checks if a given input is empty
function isEmpty(input)
{
  if(input.trim()=="")
  {
    return true;
  }
  return false;
} 

// Registration Function
function register(registration){

    // Variables
    let email = registration.parent().find("#Email")[0].value;
    let pass =registration.parent().find("#Password")[0].value;
    let confirmPass = registration.parent().find("#ConfirmPass")[0].value;
    let passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})");
    

      //Check if there are any empty input fields
  if(!(isEmpty(email) || isEmpty(pass) || isEmpty(confirmPass))){
        if(pass === confirmPass){
            // Check if password consists of a small letter, capital letter,
            // number, special characater, and a minimum of 6 characters.
            if(passwordRegex.test(pass))
            {
                passwordStrong = true;
                passwordMatch = true;
            }
            else{
                $("#errormsg")[0].innerHTML = "Password be at least 6 characters and contain a-z, A-Z, 0-9, !%^&.";
                $("#Password").css("border-bottom", "2px solid rgb(250, 68, 68)");
            }
        }

        else{
            $("#errormsg")[0].innerHTML = "Passwords do not match";
            $("#Password").css("border-bottom", "2px solid rgb(250, 68, 68)");
            $("#ConfirmPass").css("border-bottom", "2px solid rgb(250, 68, 68)");
        }
    }

    // if there are any black inputs send error msg.
    else{
        $("#errormsg")[0].innerHTML = "All fields are required to proceed."
    }
}

function login(login){

    let request = new XMLHttpRequest();
    
    // Variables
    let email = login.parent().find("#emailInput")[0].value;
    let pass = login.parent().find("#passInput")[0].value;

    // If inputs are not empty, send to server.
    if(!(isEmpty(email) || isEmpty(pass))){

        //Set up request and send it
        request.open("POST", '/login', true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("email="+ email +"&pass="+ pass);
    }

    // Else display error msg.
    else{
        $("#errormsg")[0].innerHTML = "All fields are required to proceed.";
    }

    // If receive response from server
    request.onload = () => {
        // If response is "ok", log the user in.
        switch(request.responseText){
            default :
                userFunctionality();
            break;

            case "invalid" :
                $("#errormsg")[0].innerHTML = "Invalid login details. Please try again.";
            break;
        }
    };
}

/******************** Includes Profile Section ********************/
// Restructure layout of webpage to allow user functionality such as save and view profile.
function userFunctionality(){

    //Variables
    let newButtons= ["Profile" , "Logout"];
    let icons = [
        "<ion-icon class='menu-item-button' name='person-outline'></ion-icon>",
        "<ion-icon class='menu-item-button' name='log-out-outline'></ion-icon>"
    ];
    let nthChild = 3;
    
    // 1. Remove #modalBackground container.
    $("#modalBackground").remove();

    // 2. Remove unneccessary .menu-items.
    $("#navigation a:nth-child(3)").remove();
    $("#navigation a:nth-child(3)").remove();

    // 2. Arrange 3rd and 4th children of #Navigation (Login button and Register button) to myProfile and Logout.
    for(let i = 0; i < 2; i++){
        $("<a><span class='menu-item-text'>"+newButtons[i]+"</span>" + icons[i] + "</a>").appendTo("#navigation");
        $("#navigation a:nth-child("+nthChild+")").removeClass().addClass("menu-item");
        $("#navigation a:nth-child("+nthChild+")").attr('id', newButtons[i].toLowerCase());
        $("#navigation a:nth-child("+nthChild+")").attr('href', '#');
        nthChild++;
    }

    // 3. Add tooltip events.
    addTooltipEvent(".menu-item-button");

    // 4. Arrange left panel area.
    $(".call-to-action")[0].innerHTML =
    "<span>Palette name:</span><input id='paletteName'><a class='btn' id='share'>Share</a>";

    /******************** Event Handlers ********************/
    $("#profile").click(function(){
        createProfile();
    });

    $("#logout").click(function(){
        logout();
    });

    $("#share").click(function(){
        share(); 
    });
}

function newScene(section){
    // Remove createMenu
    // Rearrange grid

    // 1. Remove #createMenu because it is not needed for explore section
    $("#createMenu").css("display", "none");
    
    // 2. Remove #CenterPanel
    $("#CenterPanel").css("display", "none");

    // 3. Rearrange .logo and #MenuBar
    $("#LeftPanel").css({
        "grid-row-start" : "1",
        "grid-column-end" : "3",
        "height" : "auto"
    });

    // 4. Reset container's column template
    $(".container").css("grid-template-columns", "auto");

    // 5. Remove all dynamically added sections
    $("#exploreSection").remove();
    $("#profileSection").remove();

    // 5. Check if .container has section.
    if($(".container").has(section).length < 1){
        $(".container").append("<div id='"+section.substring(1)+"'></div>");
    }
    else{
        $(section).empty();
    }
}

function createProfile(){
    // Populate results from db
    // Display resultset on screen
        
    // 1. Set newScene( )
    newScene("#profileSection");

        // 2. Get User Data
        $.get(`/profile`, (data) => {
    
        // 3. Create user details section.
            let userDetails = 
                "<div id='userDetails'>"+                                             
                    "<h1 class='header'>Your <span class='accent'>Account</span></h1>"+ 
                    "<p>Username: <span>"+data.username+"</span></p>"+
                    "<p>Email: <span>"+data.email+"</span></p>"+
                    "<a class='btn'>Change password</a>" +                                
                "</div>";

            // 4. Append user details section to #profileSection
            $("#profileSection").append(userDetails);

            // 5. Create palettes section.
            let paletteSection = 
                "<div id='userPalettes'>" +                                              
                    "<label for='sort'>Sort by:</label>" +                                    
                    "<select id='sort'>" +                                                 
                        "<option value='Most Recent'>Most Recent</option>" +           
                        "<option value='Date Created'>Date Created</option>" + 
                    "</select>" +
                    "<div id='creations'>" + 
                        "<span class='palette-header'>My Palettes</span>" +
                        "<div id='creationPalettes'></div>" +
                    "</div>" +
                    "<div id='saved'>" + 
                        "<span class='palette-header'>Saved Palettes</span>" +
                        "<div id='savedPalettes'></div>" +
                    "</div>";

            // 6. Append palettes section to #profileSection
            $("#profileSection").append(paletteSection);

            for(let i = 0; i < data.palettes.length; i++){

                // 7. Add a .palette-card to #creationPalettes.
                $("#creationPalettes").append("<div id='createdCard"+i+"'></div>");
                $("#createdCard"+i).append("<div class='created-palette'></div>");

                // 8. Create user palettes.
                let cardInfo = "";

                // 9.  Create userPalettes section.
                cardInfo +=                              
                        "<div class='card-info'>"+                                         
                            "<p>Palette name: <span>"+data.palettes[i].name+"</span></p>"+                       
                            "<p>Created on <span>"+data.palettes[i].creationDate.substring(0,10)+"</span></p>"+                                         
                            "<ion-icon class='view-btn' name='eye-outline'></ion-icon>"+                                                           
                            "<span class='card-tooltip'>View</span></div>" +                                      
                        "</div>" +                                                                             
                    "</div>";

                // 10. Append .card-info to #createdCard
                $("#createdCard"+i).append(cardInfo);

                // 11. Add colours of palettes to array of object colours
                let colours = [ data.palettes[i].colour1, data.palettes[i].colour2, data.palettes[i].colour3, data.palettes[i].colour4 ];

                // 12. Add colours to .palette-card.
                for(let j = 0; j < 4; j++){
                    $("#createdCard"+i).find(".created-palette").append("<div class='cp-colour' style='background:"+colours[j]+"'</div>");
                } 
            }
        });
}

function logout(){
    $.get(`/logout`, (data) => {
        if(data){
            location.reload();
        }
    });
}

function share(){
    let paletteName;
}