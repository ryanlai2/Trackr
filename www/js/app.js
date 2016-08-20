angular.module('todo', ['ionic'])
/**
 * The Projects factory handles saving and loading projects
 * from local storage, and also lets us save and load the
 * last active project index.
 */
.factory('Categories', function() {
  return {
    all: function() {
      var projectString = window.localStorage['projects'];
      if(projectString) {
        return angular.fromJson(projectString);
      }
      return [];
    },
    save: function(projects) {
      window.localStorage['projects'] = angular.toJson(projects);
    },
    newProject: function(projectTitle) {
      // Add a new project
      return {
        title: projectTitle,
        tasks: []
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    }
  }
})

.controller('TodoCtrl', function($scope, $timeout, $ionicModal, Categories, $ionicSideMenuDelegate, $ionicListDelegate) {

  // A utility function for creating a new project
  // with the given projectTitle
  var createProject = function(projectTitle) {
    var newProject = Categories.newProject(projectTitle);
    $scope.projects.push(newProject);
    Categories.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length-1);
  }


  // Load or initialize projects
  $scope.projects = Categories.all();

  // Grab the last active, or the first project
  $scope.activeProject = $scope.projects[Categories.getLastActiveIndex()];

  // Called to create a new project
  $scope.newProject = function() {
    var projectTitle = prompt('Project name');
    if(projectTitle) {
      createProject(projectTitle);
    }
  };

  // Called to select the given project
  $scope.selectProject = function(project, index) {
    $scope.activeProject = project;
    Categories.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  // Create our modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope
  });

  $ionicModal.fromTemplateUrl('edit-task.html', function(modal) {
    $scope.editTaskModal = modal;
  }, {
    scope: $scope
  });

  $scope.createTask = function(task) {
    if(!$scope.activeProject || !task) {
      return;
    }
    $scope.activeProject.tasks.push({
      title: task.title
    });
    $scope.taskModal.hide();

    // Inefficient, but save all the projects
    Categories.save($scope.projects);

    task.title = "";
  };



  $scope.deleteTask= function(task){
    if(!$scope.activeProject || !task)return;

    $scope.activeProject.tasks.splice($scope.activeProject.tasks.indexOf(task),1);
    Categories.save($scope.projects);
    task.title="";
    $ionicListDelegate.closeOptionButtons();
  }

  $scope.newTask = function() {
    $scope.taskModal.show();
  };
  $scope.editTask=function(task){
  

    //remember task to change it later
    $scope.tempEditTask = task;

    //show the Modal 
      $scope.editTaskModal.show();
  };

//Concept..
  $scope.editTitleTask = function(form){
     // if(!$scope.activeProject || !task)return;
     // $scope.activeProject.tasks[$scope.activeProject.tasks.indexOf(task)].title = newTitle;
     // $scope.editTaskModal.hide();
     // console.log(form.title);
     var item={};
     item.title = form.title;
     console.log(item.title);

     //get index of item from array
     var editIndex = $scope.activeProject.tasks.indexOf($scope.tempEditTask);
     console.log(editIndex);

     //swap
     // console.log($scope.activeProject.tasks[editIndex].title);
     $scope.activeProject.tasks[editIndex]=item;
     // console.log($scope.activeProject.tasks[editIndex].title);
     $scope.editTaskModal.hide();
    Categories.save($scope.projects);
     
  }
  
  /*
//editing a task
  $scope.editTask=function(tasks){
    var taskToEdit = tasks;
    console.log(taskToEdit);
    var modalInstance = $modal.open({
      templateUrl:'edit-task.html',
      controller: modalInstanceCtrlr,
      resolve: {
        tasks: function(){
          return taskToEdit;
        }
      },
      scope: $scope.$new()
    });
    modalInstance.result.then(function(selectedItem){
        console.log('selectedItem: ' + selectedItem.title);
          taskToEdit.title= selectedItem.title;
    }, function(){
      console.log('Modal dismissed at: ' + new Date());
    });
  };

  modalInstanceCtrlr= function($scope, $modalInstance, tasks){
    $scope.input = angular.copy(tasks);
    console.log(tasks);
    $scope.saveTask ={
      $modalInstance.close($scope.input);
    };
  };
  */

  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  }


  // $scope.closeEditTask=func7);
  // }

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
    $ionicListDelegate.closeOptionButtons();
  };


  // Try to create the first project, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  $timeout(function() {
    if($scope.projects.length == 0) {
      while(true) {
        var projectTitle = prompt('Your first project title:');
        if(projectTitle) {
          createProject(projectTitle);
          break;
        }
      }
    }
  }, 1000);

})
