/**
 * Created by douson on 03.07.15.
 */
Meteor.startup(function () {


  Router.map(function () {
    this.route('chats', {
      path: '/chats',
      controller: 'bz.bus.requireLoginController',
      onBeforeAction: function () {
        Router.go('/chats/my');
      }
    });
    this.route('chats.id', {
      path: '/chat/:chatId',
      template: 'bzChatId',
      controller: 'bz.bus.requireLoginController',
      subscriptions: function () {
        // return [];
      },
      waitOn: function () {
        if (this.data()) return;

        var dep = new Deps.Dependency;
        var ready = false;
        var handle = {
          ready: function () {
            dep.depend();
            return ready;
          }
        };

        var self = this,
          chatID = this.params.chatId,
          request = { chatId: chatID };

        Meteor.call('getMessages', request, function (e, r) {

          var res;
          res = (!e) ? r : e;

          if (res.error && res.message) {
            bz.ui.alert('Error ID: ' + res.error, {
              type: 'error',
              timeout: 2000
            });
            return;
          }

          if (res.success && res.result) {
            (res.result.length > 0) ? self.result = r.result.reverse() : self.result = [];
            //console.info('Данные из метода getMessage[s]: ', ins.getMessagesData.get());
          } else {
            bz.ui.alert('Error ID: ' + res.error.errorId, {
              type: 'error',
              timeout: 2000
            });
          }

          ready = true;
          dep.changed();

        });


        return handle;

        /* OLD CODE */
        /*return [
          //Meteor.subscribe('bz.users.byId', this.params.userId)
          Meteor.subscribe('bz.users.all'),
          Meteor.subscribe('bz.chats.id', chatId, Meteor.userId()),
          Meteor.subscribe('bz.messages.chatId', chatId)
        ]*/
      },
      result: null,
      data: function () {
        /*var chatId = this.params.chatId,
          chat = bz.cols.chats.findOne(chatId),
          user = chat && chat.users && _.without(chat.users, Meteor.userId())[0];

       if (user && chat) {
          var ret = {
            chat: chat,
            user: Meteor.users.findOne(user),
            messages: bz.cols.messages.find({chatId: chatId})
          }
        }
        return ret;*/

        return this.result;
      },

      onBeforeAction: function () {
        this.next();
        /*if (!this.data() || !this.data().user || !this.data().messages) {
          Router.go('/page-not-found');
        } else {
          this.next();
        }*/
      }
    });

    this.route('chats.my', {
      path: '/chats/my',
      template: 'bzPageChats',
      controller: 'bz.bus.requireLoginController',
      waitOn: function () {
        return [
          //Meteor.subscribe('bz.users.all'),
          Meteor.subscribe('bz.chats.my', Meteor.userId())
        ]
      },
      data: function () {
        return bz.cols.chats.find({
          userId: Meteor.userId()
        });
      }
    });

    // create post flow:
    this.route('chats.new', {
      path: '/chats/new',
      controller: 'bz.bus.requireLoginController'
    });
  });
  /*

   this.route('chats.id', {
   path: '/chat/:userId',
   template: 'bzChatId',
   controller: 'requireLoginController',

   waitOn: function(){
   var usersArr = [],
   currentUser = Meteor.user(),
   friendUserId = this.params.userId;
   currentUser && usersArr.push(currentUser._id);
   friendUserId && usersArr.push(friendUserId);
   return [
   //Meteor.subscribe('bz.users.byId', this.params.userId)
   Meteor.subscribe('bz.users.all'),
   Meteor.subscribe('bz.messages.users', usersArr)
   ]
   },
   data: function () {
   var usersArr = [],
   currentUser = Meteor.user(),
   friendUserId = this.params.userId;
   currentUser && usersArr.push(currentUser._id);
   friendUserId && usersArr.push(friendUserId);
   var ret = {
   user : Meteor.users.findOne({ _id: this.params.userId }),
   messages: bz.cols.messages.find({userId: {$in: usersArr}, toUserId: {$in: usersArr}})
   }
   return ret;
   },

   onBeforeAction: function () {
   if (!this.data() || !this.data().user || !this.data().messages) {
   Router.go('/page-not-found');
   } else {
   this.next();
   }
   }
   });*/
});
