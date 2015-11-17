var React = require('react');
var Router = require('react-router');
var Repos = require ('./github/repos');
var UserProfile = require ('./github/user-profile');
var Notes = require ('./notes/notes');
var ReactFireMixin = require('reactfire');
var Firebase = require('firebase');
var helpers = require('../utils/helpers');

var Profile = React.createClass({
  mixins: [Router.State, ReactFireMixin],
  getInitialState: function(){
    return {
      notes: [],
      bio:  [],
      repos: []
    }
  },
  componentDidMount: function(){
    this.ref = new Firebase('https://manny-github.firebaseio.com');
    var childRef = this.ref.child(this.getParams().username);
    this.bindAsArray(childRef, 'notes');

    helpers.getGithubInfo(this.getParams().username)
      .then(function(dataObj){
        this.setState({
          bio: dataObj.bio,
          repos: dataObj.repos
        });
      }.bind(this));
  },
  componentWillUnmount: function(){
    this.unbind('notes');
  },
  handleAddNote: function(newNote){
    this.firebaseRefs['notes'].push({
    text: newNote
    });
  },
  render: function(){
    var username = this.getParams().username;
    return (
      <div className="row">
        <div className="col-md-4">
          <UserProfile username={username} bio={this.state.bio} />
        </div>
        <div className="col-md-4">
          <Repos username={username} repos={this.state.repos} />
        </div>
        <div className="col-md-4">
          <Notes 
            username={username} 
            notes={this.state.notes} 
            addNote={this.handleAddNote}
          />
        </div>
      </div>
    )
  }
});

module.exports = Profile;