var app = angular.module('site', ['ui.bootstrap', 'ngAria']);

app.factory('Backend', ['$http',
    function($http) {
        var get = function(url) {
            return function() {
                return $http.get(url).then(function(resp) {
                    return resp.data;
                });
            }
        };

        return {
            repos: get('data/repos.json')
        }
    }
])
.controller('MainCtrl', ['Backend', '$scope', 'filterFilter', 
    function(Backend, $scope, filterFilter) {
        var self = this;
        
        // Backend.orgs().then(function(data) {
        //     self.orgs = data;
        // });
        
        Backend.repos().then(function(data) {
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

