'use strict';

var visitsApp = angular.module('visits');

//Autocompleate - Factory
visitsApp.factory('SessionDataService', ["$http", function ($http) {
  return {
    search: function (term) {
      //var client = {title: new RegExp(term, 'i')};
      var maxRecs = 10;
      var fields = ('title _id');
      var sort = ({title:'ascending'});
      return $http({
        method: 'GET',
        url: '/api/v1/secure/feedbackDefs/find',
        params: { query: term, fields: fields, maxRecs: maxRecs, sort: sort }
      }).then(function (response) {
        return response.data;
      });
    }
  };
}]);

visitsApp.controller('sessionsControllerMain', ['$scope', '$http', '$routeParams', '$location', 'growl', '$filter', '$mdDialog','SessionService',
  function($scope, $http, $routeParams ,$location, growl, $filter, $mdDialog,SessionDataService) {

		$scope.visitId = $routeParams.id;

		$scope.small= "small";
		$scope.large= "LARGE";
		$scope.medium= "medium";
		//filter table
		$scope.showAll = true;
		$scope.showFiltered = false;
		$scope.hideFilter = true;
		$scope.meetingPlaces =[];

		var init = function() {
			$http.get('/api/v1/secure/visits/' + $scope.visitId).success(function(response) {
				$scope.visit = response;
				$scope.visitStartDate = $scope.visit.startDate;
				$scope.visitEndDate = $scope.visit.endDate;
				$scope.scheduleDates = $scope.buildScheduleDates();
				$scope.session = $scope.visit.sessionTmpl.title;//session feedback default title
				$scope.sessionFeedbackDefaultId = $scope.visit.sessionTmpl._id;//session feedback default id
				for(var i=0;i<$scope.visit.schedule.length;i++)
				{
				$scope.meetingPlaces.push($scope.visit.schedule[i].meetingPlace);
				$scope.meetingPlacesData = $scope.meetingPlaces.toString();//pushing all meeting location data to meetingPlacesData
				}
			});

			$http.get("/api/v1/secure/visits/" + $scope.visitId + "/getLocations").success(function(response) {
				$scope.location = response;
				console.log($scope.location);
			});
		}

		var refresh = function(){
			$http.get('/api/v1/secure/visitSchedules/visit/' + $scope.visitId ).success(function(response) {
				$scope.scheduleList = response;
			}); // get visitSchedule call back ends
		}; // refresh method ends

		init();
		refresh();

	  $scope.sendMeetingPlace = function(meetingPlacesData)
	  {
	  $scope.sessionMeetingData = meetingPlacesData;
	  }

	  $scope.sendFeedbackId = function(sessionId)
	  {
	  if($scope.mode =='add')
	  {
	  	if(sessionId != undefined || sessionId != '')
	  	{
	  		$scope.sessionFeedbackId = sessionId;
	  	}

	  	if(sessionId == '' || sessionId == undefined)
	  	{
	  		$scope.sessionFeedbackId = $scope.sessionFeedbackDefaultId;
	  	}
	  }

	  if($scope.mode =='edit')
	  { 
	  	$scope.sessionFeedbackId = sessionId;
	  }
	}

	  $scope.buildScheduleDates = function()
	  {
			return DatesInRange($scope.visitStartDate, $scope.visitEndDate);
	  }

	  	$scope.showAllSchedules = function(location)
	  	{	
	  		$http.get('/api/v1/secure/visitSchedules/visit/' + $scope.visitId ).success(function(response) {
	  			$scope.scheduleList = response;
	  		});
	  		$scope.showAll = true;
	  		$scope.showFiltered = false;
	  	}

		$scope.setEntryDate = function(dt,index){

				console.log(index);

				$scope.entryDate = dt;
				$scope.index = $scope.location[index];
				$scope.showFiltered = true;
				$scope.showAll = false;


				if($scope.index == "Hyderabad")
				{
					$scope.rooms = ['Hyd Board Room','B7 1st Floor Conference Room','B4 Cafeteria',
	    'B4 Executive Dining Room','Hyd Amphi Theatre','Hyd Main Lobby'];
				}

				else if($scope.index == "Noida")
				{
					$scope.rooms = ['Noida Board Room','Noida Cafeteria','Noida Amphi Theatre','Noida Main Lobby'];
				}

				else if($scope.index == "Chennai")
				{
					$scope.rooms = ['Chennai Lobby Area','Chennai Ex Lunch','Chennai Amphi Theatre','Chennai Main Lobby'];
				}

				else if($scope.index == "Bangalore")
				{
					$scope.rooms = ['Bng Lobby Area','Bng Ex Lunch','Bng Amphi Theatre','Bng Main Lobby'];
				}

				else if($scope.index == "Mumbai")
				{
					$scope.rooms = ['Mumbai Lobby Area','Mumbai Ex Lunch','Mumbai Amphi Theatre','Mumbai Main Lobby'];
				}

				else if($scope.index == "Vadodara")
				{
					$scope.rooms = ['Vadodara Lobby Area','Vadodara Ex Lunch','Vadodara Amphi Theatre','Vadodara Main Lobby'];
				}

				else if($scope.index == "Indore")
				{
					$scope.rooms = ['Indore Lobby Area','Indore Ex Lunch','Indore Amphi Theatre','Indore Main Lobby'];
				}

				console.log($scope.rooms);
		}

		$scope.dayFilter = function (schedule) {
			if($scope.entryDate === "")
				return true;

			var dt1 = moment.utc(schedule.scheduleDate);
			var dt2 = moment.utc($scope.entryDate);

			var duration = moment.duration(dt2.diff(dt1));
			var days = duration.asDays();

			return (days==0);

		};

		$scope.addSchedule = function(){
	    $scope.mode = "add";
			$scope.schedule="";
			angular.element('#myModalShower').trigger('click');
	  }

	  $scope.addSchedule1 = function(ev){
	    $scope.mode = "add";
			$scope.schedule="";
	    $scope.showAdvanced(ev);
	  }

	  $scope.editSession = function(ev, id){
	    $scope.mode = "edit";
	    $http.get('/api/v1/secure/visitSchedules/' + id ).success(function(response) {
	      $scope.schedule = response;
				// reassign data
	      $scope.startTime = DateGetTime($scope.schedule.session.startTime);
	      $scope.endTime = DateGetTime($scope.schedule.session.endTime);
	      $scope.startHourTime = $scope.startTime.split(":")[0];
	      $scope.startMinTime = $scope.startTime.split(":")[1];
	      $scope.endHourTime = $scope.endTime.split(":")[0];
	      $scope.endMinTime = $scope.endTime.split(":")[1];
	      $scope.meetingPlaceData = $scope.schedule.session.location;
	      $scope.sessiondfbid = $scope.schedule.feedbackTemplate;
	      $http.get('/api/v1/secure/feedbackDefs/id/' + $scope.sessiondfbid).success(function(response) {
	  	  $scope.sessiondata = response.title;
	      });

				$scope.ownerId = $scope.schedule.session.owner;
				$scope.supporterId = $scope.schedule.session.supporter;
				$scope.arraydata = $scope.schedule.invitees;

	      $scope.showAdvanced(ev);
	    }); // get visitSchedule call back ends
	  }

	$scope.checkTime = function()
	 {
	var start_time = $scope.startHourTime + $scope.startMinTime;
	var end_time = $scope.endHourTime + $scope.endMinTime;

	if (start_time > end_time || end_time < start_time) {
		$scope.errMessage = "Wrong Time Entry Done !!!"
	}

	else
	{
		$scope.errMessage="";
	}
    };

	  $scope.deleteSession = function(schedule) {
	    $http.delete('/api/v1/secure/visitSchedules/' + schedule._id).success(function(response) {
	      growl.info(parse("Title: [%s]<br/>Session schedule deleted successfully", schedule.session.title));
	      refresh();
	    })
	    .error(function(data, status) {
	      growl.error("Error deleting visitSchedule");
	    }); // http delete visitSchedule ends
	  }; // delete method ends

	  $scope.save = function() {
	    $scope.schedule.scheduleDate = $scope.entryDate;
	    $scope.schedule.visit = $scope.visit._id;
	    $scope.schedule.client = $scope.visit.client._id;
	    $scope.schedule.invitees = $scope.arraydata;
	   // $scope.schedule.session.location = $scope.meetingPlacesData;
			//session invitees to be added

			// session info
		// console.log($scope.startHourTime);
		// console.log()
			$scope.schedule.session.owner = $scope.ownerId;
	    $scope.schedule.session.supporter = $scope.supporterId;
	    var startTime = $scope.startHourTime + ":" +$scope.startMinTime;
	    var endTime = $scope.endHourTime + ":" +$scope.endMinTime;
	    $scope.schedule.session.startTime = DateReplaceTime($scope.entryDate, startTime);
	    $scope.schedule.session.endTime = DateReplaceTime($scope.entryDate, endTime);
	   	if($scope.mode == 'add')
	   	{	
	  //   	if($scope.sessionMeetingData == '' || $scope.sessionMeetingData == undefined)
	  //   	{
	  //   	$scope.schedule.session.location = $scope.meetingPlacesData;
			// }

			if($scope.sessionFeedbackId == '' || $scope.sessionFeedbackId == undefined)
			{
				$scope.schedule.feedbackTemplate = $scope.sessionFeedbackDefaultId;
			}
		}

		if($scope.mode == 'edit')
	   	{
	   		// if($scope.sessionMeetingData == '' || $scope.sessionMeetingData == undefined)
	   		// {
	   		// 	$scope.schedule.session.location = $scope.meetingPlaceData;
	   		// }

	   		if($scope.sessionFeedbackId == '' || $scope.sessionFeedbackId == undefined)
	   		{
	   			$scope.schedule.feedbackTemplate = $scope.sessiondfbid;
	   		}
	   	}	

		// if($scope.sessionMeetingData != '' && $scope.sessionMeetingData != undefined)
		// {
		//  $scope.schedule.session.location = $scope.sessionMeetingData;
		// }


		if($scope.sessionFeedbackId != '' && $scope.sessionFeedbackId != undefined)
		{
			$scope.schedule.feedbackTemplate = $scope.sessionFeedbackId;
		}

	    switch ($scope.mode) {
	      case "add":
	        $scope.create();
	        break;

	      case "edit":
	        $scope.update();
	        break;
	    } // end of switch scope.mode ends
	  } // end of save method
	  console.log($scope.schedule);
	  $scope.create = function() {
	    $http.post('/api/v1/secure/visitSchedules', $scope.schedule).success(function(response) {
	      console.log(response);
	      growl.info(parse("Title: [%s]<br/>New session schedule added", $scope.schedule.session.title));
				$mdDialog.hide();
	    })
	    .error(function(data, status) {
	      growl.error("Error adding visitSchedule");
	    }); // http post visitSchedule ends
	  }; // create method ends

	  $scope.update = function() {
	    $http.put('/api/v1/secure/visitSchedules/' + $scope.schedule._id, $scope.schedule).success(function(response) {
	      growl.info(parse("Title: [%s]<br/>Session schedule updated successfully", $scope.schedule.session.title));
	           $mdDialog.hide();
				//refresh();
	    })
	    .error(function(data, status) {
	    	growl.error("Error updating visitSchedule");
	    }); // http put visitSchedule ends
	  }; // update method ends

	  // type field dropdown list
	  $scope.prTypes = ['Presentation','Discussion','Breakfast','Tea-Break','Lunch','Dinner','Floor-Walk'];

	  // location field dropdown list
	  $scope.locations = [{
	    "city" : "Hyderabad",
	    "rooms": ['Hyd Board Room','B7 1st Floor Conference Room','B4 Cafeteria',
	    'B4 Executive Dining Room','Hyd Amphi Theatre','Hyd Main Lobby']
	  },
	  {
	    "city" : "Noida",
	    "rooms": ['Noida Board Room','Noida Cafeteria','Noida Amphi Theatre','Noida Main Lobby']
	  },
	  {
	    "city" : "Chennai",
	    "rooms": ['Chennai Lobby Area','Chennai Ex Lunch','Chennai Amphi Theatre','Chennai Main Lobby']
	  },
	  {
	    "city" : "Bangalore",
	    "rooms": ['Bng Lobby Area','Bng Ex Lunch','Bng Amphi Theatre','Bng Main Lobby']
	  }];


		$scope.showAdvanced = function(ev) {
			$mdDialog.show({
				templateUrl: '/public/mods/visits/sessions/sessionAddDialog0.html',
				parent: angular.element(document.body),
				scope:$scope.$new(),
				targetEvent: ev,
				clickOutsideToClose:false
			})
			.then(function(response) {
				refresh();
			});

		}

		$scope.hide = function() {
			$mdDialog.hide();
		};
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.answer = function(answer) {
			$mdDialog.hide(answer);
		};

	}

]);

//Autocompleate - Directive
visitsApp.directive("sessiondata", ["SessionDataService", function (SessionDataService) {
  return {
    restrict: "A",              //Taking attribute value
    link: function (scope, elem, attr, ctrl) {
      elem.autocomplete({
        source: function (searchTerm, response) {
          SessionDataService.search(searchTerm.term).then(function (autocompleteResults) {
            response($.map(autocompleteResults, function (autocompleteResult) {
              return {
                label: autocompleteResult.title,
                value: autocompleteResult.title,
                id: autocompleteResult._id
              }
            }))
          });
        },
        minLength: 4,
        select: function (event, selectedItem) {
          scope.sessiondata= selectedItem.item.value;
          scope.sessionId= selectedItem.item.id;
          scope.$apply();
          event.preventDefault();
        }
      });
    }
  };
}]);