Volunteers = new Meteor.Collection("volunteers");

if (Meteor.isClient) {
  Template.main.created = function (){
    Session.set('currentTemplate', 'cardSwiper');
        Session.set('currentVolunteer', '');

  };
  Template.dynamicTemplate.chooseTemplate = function () {
    return { template: Template[Session.get('currentTemplate')] };
};
var timeout;

function saveVolunteer(){
  if (isNaN($('#votes').val()) || isNaN($('#points').val())){
    $.bootstrapGrowl("You can't use words as numbers! Sillyface.", {
            type: 'warning',
            align: 'left',
            stackup_spacing: 30
        });
  } else {
    var updateObj = {
        cardNum: Session.get('currentVolunteer'),
        name: $('#name').val(),
        birthday: $('#birthday').val(),
        votes: $('#votes').val(),
        points: $('#points').val(),
        began: $('#began').val(),
        magBridge: $('#magBridge')[0].checked,
        magComp: $('#magComp')[0].checked,
        phoDoc: $('#phoDoc')[0].checked,
        phoComp: $('#phoComp')[0].checked,
        odyDoc: $('#odyDoc')[0].checked,
        odyComp: $('#odyComp')[0].checked,
        galPass: $('#galPass')[0].checked
      };
      Meteor.call('updateVolunteer',Session.get('currentVolunteer'),updateObj)
      Session.set('currentTemplate', 'cardSwiper');
      Session.set('currentVolunteer', '');
      return false;
    }
}
Template.cardSwiper.events = {
  'keyup #cardinput': function(e){
    var key = e.which;
    target = e.target;
    if ($(target).val().charAt(0) === "%"){
      if (timeout){Meteor.clearTimeout(timeout)};
      timeout = Meteor.setTimeout(function(){
        Session.set('currentTemplate', 'cardData');
        Session.set('currentVolunteer', $(target).val().substr(2,16));
      },100);
   } else {
   if (key == 13) {
       Session.set('currentTemplate', 'cardData');
       Session.set('currentVolunteer', $(target).val()); //.substr(2,16));
    }
   }
  },
  'mouseup #submit': function(e){
    target = $('#cardinput')[0];
    Session.set('currentTemplate', 'cardData');
    Session.set('currentVolunteer', $(target).val()); //.substr(2,16));
  }
};

Template.cardData.events = {
  'click #short-private': function(){
    $('#points').val(parseFloat($('#points').val()) + 2.5);
    saveVolunteer();

  },
  'click #long-private': function(){
    $('#points').val(parseFloat($('#points').val()) + 5);
    saveVolunteer();
  },
  'click #addCustom': function(){
    if (!parseFloat($('#customValue').val())){
      $('#points').val(parseFloat($('#points').val()) + parseFloat($('#customValue').val()));
      saveVolunteer();
    } else {
      
    }
  }
};

Template.info.events = {
  'mouseup #close': function(){
    Session.set('currentTemplate', 'cardSwiper');
    Session.set('currentVolunteer', '');
  },
  'mouseup #save': function(){
    saveVolunteer();
  }
};

Template.info.newVolunteer = function() {
  return (!Volunteers.findOne({cardNum: Session.get('currentVolunteer')}));
};
Template.info.rendered = function() {
    $('.datetimepicker').datetimepicker({ pickTime: false});
};
Template.info.volunteerName = function() {
  if (Volunteers.findOne({cardNum: Session.get('currentVolunteer')})){
    return (Volunteers.findOne({cardNum: Session.get('currentVolunteer')}).name);
  } else {
    return false;
  }
};
Template.info.volunteerBirthday = function() {
  if (Volunteers.findOne({cardNum: Session.get('currentVolunteer')})){
  return (Volunteers.findOne({cardNum: Session.get('currentVolunteer')}).birthday);
    } else {
    return false;
  }
};
Template.info.volunteerPoints = function() {
  if (Volunteers.findOne({cardNum: Session.get('currentVolunteer')})){
  return (Volunteers.findOne({cardNum: Session.get('currentVolunteer')}).points);
    } else {
    return false;
  }
};
Template.info.volunteerVotes = function() {
  if (Volunteers.findOne({cardNum: Session.get('currentVolunteer')})){
  return (Volunteers.findOne({cardNum: Session.get('currentVolunteer')}).votes);
    } else {
    return false;
  }
};
Template.info.volunteerBegan = function() {
  if (Volunteers.findOne({cardNum: Session.get('currentVolunteer')})){
  return (Volunteers.findOne({cardNum: Session.get('currentVolunteer')}).began); //.toDateString());
    } else {
    return false;
  }
};
Template.passes.hasPass = function(which) {
    if (Volunteers.findOne({cardNum: Session.get('currentVolunteer')})){
      return (Volunteers.findOne({cardNum: Session.get('currentVolunteer')})[which]);
    } else {
      return false;
    }
};
}

if (Meteor.isServer) {
  Meteor.methods({
    updateVolunteer: function(currentVolunteer, updateObj){
     Volunteers.upsert({cardNum: currentVolunteer}, {$set: updateObj});
     return 'Hi there!';
    }
  });
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
