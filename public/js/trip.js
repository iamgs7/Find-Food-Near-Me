var userCurrent,
count = 0,
hopCity = [],
hopRest = [],
finalHopList = [];
$(document).ready(function() {
    init();
});

function init() {
    var cities = ['San-Francisco', 'San-Diego', 'Fullerton', 'Los-Angeles', 'Anaheim', 'San Jose', 'Monterey', 'Palo-Alto', 'Long Beach', 'Santa Monica', 'Sacramento'];
    cities = cities.sort();
    var output = "";
    for (x in cities) {
        output += "<a onclick=\"getCityRests('"+ cities[x] +"')\"class=\"chip\">" +
            cities[x] +
            "</a>&nbsp;&nbsp;&nbsp;"
    }
    $('#cities').append(output);
}

var vm = {
    searchResults: ko.observableArray()
};
/*var clickToAdd = {
  addToList: function(data, event){
    console.log('hi' + data + "\n" + event);
  }
};*/
ko.applyBindings(vm);


function getCityRests(cityName) {
  $('#modal_citySelect').closeModal();
  count = 1;
  hopCity.push(cityName);
  vm.searchResults.removeAll();
  console.log('You will get ' + cityName);
  //Fetch restaurants nearby
    $.ajax({
        url: '/findHangout',
        dataType: "json",
        data: {
            "cityName": cityName
        },
        type: 'GET',
        success: function(data) {
            //console.log(data);
            data.businesses.forEach(function(business) {
                //console.log(business);
                business.newID = business.id + "123";
                business.newIDlink = "#" + business.newID;
                vm.searchResults.push(business);
                var restaurant = business.name;
            });
            $('#findList').hide();
            $('#findList').fadeIn(3000);
            $('textarea').characterCounter();
            $('select').material_select();
            $(".userReview").hide();
            $('.modal-trigger').leanModal();
        },
        error: function(xhr, status, error) {
            console.log("Restaurant search failed");
        }
    });
}

function addRestToList(data, event) {
  hopRest.push(data);
  console.log(data);
}

$('#selector').click(function(e){
  var hopTemp = "";
  if(count > 0){
    for(x in hopRest){
      hopTemp += hopRest[x];
    }
    var temp = {
      "city": hopCity[0],
      "restaurants": hopTemp
    }  
    finalHopList.push(temp);
    console.log(finalHopList[0]);
  }
  
});
