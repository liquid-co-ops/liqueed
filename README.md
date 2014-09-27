# Liqueed

Application for Liquid Cooperatives, using Node.js/Express/MongoDB.

## Setup

Clone the repository and install dependencies:
```
git clone git@github.com:liquid-co-ops/liqueed.git
cd liqueed
npm install
```

## Tests

Run the tests with:
```
npm test
```

If you have a MongoDB instance running, the database tests are:
```
simpleunit ./testdb
```

## Running the application

Run
```
npm start
```


## Code Coverage

Install `istanbul` globally:
```
npm install -g istanbul
```
Run the tests with:
```
istanbul cover node_modules/simpleunit/bin/simpleunit -- ./test ./testserver
```

If you have MongoDB running, run the tests:
```
istanbul cover node_modules/simpleunit/bin/simpleunit -- ./test ./testserver ./testdb
```

The reports is at `coverage/lcov-report/index.html`.

## Resources

- [Story Map](https://docs.google.com/spreadsheets/d/1QFt1WQqM65kJCIhMW2SoMhD75cvpBUZf8wTb-XB5i-Y/edit#gid=0-)

## References

- [LeanCoops – first draft](http://blog.agilar.org/index.php/2014/04/30/leancoops-first-draft/)
- [The new user story backlog is a map](http://www.agileproductdesign.com/blog/the_new_backlog.html)
- [Firebase](https://www.firebase.com/)
- [InVision](http://www.invisionapp.com/)

