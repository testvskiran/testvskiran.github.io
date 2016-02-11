var app = angular.module('site', ['ui.bootstrap', 'ngAria']);

app.factory('Backend', ['$http',
    function($http) {
        return {
            repos: function(callback) {
                jQuery.getJSON("https://api.github.com/user/repos?per_page=100&callback=?", function (data){//"https://api.github.com/users/" + "emcconsulting" + "/repos?per_page=100&callback=?"
                    callback(data.data);
                });
            }
        }
    }
])
.controller('MainCtrl', ['Backend', '$scope', 'filterFilter', 
    function(Backend, $scope, filterFilter) {
        var self = this;
        
        // Backend.orgs().then(function(data) {
        //     self.orgs = data;
        // });
        
        Backend.repos(function(data) {
            //self.featured = data;
            
            $scope.currentPage = 1; //current page
            $scope.maxSize = 5; //pagination max size
            $scope.entryLimit = 36; //max rows for data table
            $scope.noOfRepos = data.length;
            $scope.noOfPages = Math.ceil($scope.noOfRepos / $scope.entryLimit);
            $scope.resultsSectionTitle = 'All Repos';
            
            $scope.$watch('searchText', function(term) {
                // Create $scope.filtered and then calculate $scope.noOfPages, no racing!
                $scope.filtered = filterFilter(data, term);
                $scope.noOfRepos = $scope.filtered.length;
                $scope.noOfPages = Math.ceil($scope.noOfRepos / $scope.entryLimit);
                $scope.resultsSectionTitle = (!term) ? 'All Repos' : (($scope.noOfRepos == 0) ? 'Search results' : ($scope.noOfRepos + ' repositories found'));
            });
            
            self.projects = data;
            //self.featuredProjects = featuredProjects;
            $scope.$apply();
            //$scope.overAllStats = stats[0];
        });
    }
])
.filter('startFrom', function() {
    return function(input, start) {
        if (input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
});

