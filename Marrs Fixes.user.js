// ==UserScript==
// @name       Marrs Fixes
// @namespace  http://marrs-gsb.stanford.edu/
// @version    0.1
// @description  Autofills best defaults in the world.
// @match      https://marrs-gsb.stanford.edu/RoomRequest.asp*
// @match      https://marrs-gsb.stanford.edu/marrs/RoomRequest.asp*
// @match      https://gsbapps.stanford.edu/marrs/RoomRequest.asp*
// @copyright  2014+, GSB
// ==/UserScript==

(function($) {
  // User settings
  username = 'Moore, Adam';
  setupType = 'As is';
  attendanceCount = 2;
  eventType = 'Meeting Staff/Faculty';
  alcohol = 'No';
  catering = 'No Catering';
  
  // Get available times
  rooms = ['N203', 'N215', 'N216'];
  
  
  // Set the attendance count
  $('#ctl00_pc_Attendance_box').val(attendanceCount);
  
  // Setup ID's
  var settings = {
    ctl00_pc_SetupType_ddl: setupType,
    ctl00_pc_EventType_ddl: eventType,
    ctl00_pc_Contact_ddl: username,
    ctl00_pc_ReservationUdfs_ctl00_ddl: alcohol,
    ctl00_pc_ReservationUdfs_ctl01_ddl: catering
  };
  
  for (key in settings) {
    selectDropdown('#' + key, settings[key]);
  }
  
  // Trigger the change on the name element.
  $('#ctl00_pc_Contact_ddl').trigger('change');
  
  // Run the get available times functions.
  getAvailableTimes(rooms);
  
  // Helper function to select a dropdown.
  function selectDropdown(id, text) {
    value = $(id + ' option').filter(function () { return $(this).html() == text; }).val();
    $(id).val(value);
  }
  
  // Gets the available times for the specified rooms.
  function getAvailableTimes(rooms) {
    
    // Append the available times.
    $('#leftColumn').append('<h3 class="ui-widget-header">Available Times</h3>');
    
    // Get the data from the space browsing page.
    $.get('https://marrs-gsb.stanford.edu/marrs/BrowseForSpace.aspx', function(data) {
      $output = $('<div></div>');
      
      // Lop through all the rooms.
      for (index = 0; index < rooms.length; index++) {
        // Set some defaults.
        lists = '<ul>';
        times = [];
        
        // Find the room information and loop through all the reservations.
        $(data).find('a[title^="' + rooms[index] + '"]').parent().parent().parent().find('.e.eb.ec').each(function() {
          
          // Parse out the length and time of the reservation.
          attributes = $(this).attr('style').split(';width:');
          apptTime = attributes[0].replace('left:', '').replace('.00%', '');
          apptLength = attributes[1].replace('.00%', '');
          
          apptTime = parseInt(apptTime) - 8;
          apptLength = parseInt(apptLength);
          
          // Build the time array with all the times and the lengths.
          times[apptTime] = apptLength;
        });
        
        startTime = 28;
        ranges = {};
        
        // Loop through all the times and create availability ranges.
        for (i = 28; i<=88; i++) {
          if (times[i]) {
            if (startTime != i) {
              ranges[startTime] = i;
            }
            
            i = i + times[i] - 1;
            startTime = i + 1;
          }
        }
        
        // Add the last range.
        if (startTime < 88) {
          ranges[startTime] = 88;
        }
        
        // Convert the ranges into times and add them as li's
        for (start in ranges) {
          startTime = convertTime(start);
          endTime = convertTime(ranges[start]);
          lists += '<li>' + startTime + ' - ' + endTime + '</li>';
        }
        
        // Close our list.
        lists += '</ul>';
        
        // Append the room title to the output.
        $output.append('<h4>' + rooms[index] + '</h4>');
        
        // Append the list.
        $output.append(lists);
      }
      
      // Append it to the page.
      $('#leftColumn').append($output);
    });
    
    // This is needed because the session tends to timeout if we don't recall the url.
    $.get(document.URL, function(data) {
    });
  }
  
  // Convert decimal time to hours and minutes.
  function convertTime(time) {
    var ampm = 'am'
    var hrs = parseInt(Number(time/4));
  	var min = Math.round((Number(time/4)-hrs) * 60);
    if (hrs > 12) {
      ampm = 'pm';
      hrs = hrs - 12;
    }
    if (min == 0) {
      min = '00';
    }
    
    return hrs + ':' + min + ampm;
  }
  
})(jQuery);
