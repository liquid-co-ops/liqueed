'use strict';

$(
  function() {
    $('.confirm_remove').on('click', function() {
      if (confirm('Are you sure you want to remove this?')) {
        $(this).parent('form').submit();
      }
    })
  }
);