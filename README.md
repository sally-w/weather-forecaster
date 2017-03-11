# Weather Forecast App

### The Point
The point of this application is to show the weather in various locations.  It will also show the user a static map of the area they are viewing as well as a picture describing the current conditions.

### What to Do
To use this application:
* Load the page up 
* Choose your city from the drop down menu at the top
* Watch the objects change and update

### The Troubling Code
I had some issues getting some of the code to work.  The concept of creating something that would not truly return an object but the promise of an object was what was giving me the most trouble.  Thankfully a bit later, Dr. Babb went over asynchronous programming in class and that helped to clear up the issues that I was having with that aspect of the program.
```
$http.get("locations.txt")
				.then(function(response)
```