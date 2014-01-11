$(function(){
  var myFridge = new Firebase('https://fridge-magnets.firebaseIO.com/');

  myFridge.on('value', function(snapshot) {
    $('.magnet').remove();
    snapshot.forEach(function(child) {
      var magnet = child.val();
      var name = child.name();

      $li = $('<li></li>')
              .addClass('magnet')
              .attr('id', name)
              .text(magnet.content)
              .draggable()

      if (magnet.top) {
        $li.clone()
          .appendTo($('#fridgeclone'))
          .css({
            position: 'absolute',
            top: magnet.top,
            left: magnet.left,
            'z-index': '10'
          })
          .draggable({
            stop: function(event, ui) {
              myFridge.child(name).update({
                top: null,
                left: null
              })
            }
          });
        $li.css('visibility', 'hidden');
      }

      $('.magnets').append($li);
    });
  });

  $('#fridge').droppable({
    accept: '.magnet',
    drop: function(event, ui) {
      $('.magnet').remove();

      var id = ui.draggable.attr("id");

      var magnet = myFridge.child(id);

      magnet.update({
        top: ui.offset.top - $(this).offset().top,
        left: ui.offset.left - $(this).offset().left
      });
    }
  });
});
