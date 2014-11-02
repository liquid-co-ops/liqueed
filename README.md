[ ![Codeship Status for 
liquid-co-ops/liqueed](https://www.codeship.io/projects/ae5e9a00-2f8a-0132-1216-3ad622bf587e/status)](https://www.codeship.io/projects/39530)

# Liqueed

Application for Liquid Organizations, using Node.js/Express/MongoDB.

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

Then browse to `http://localhost:3000/`

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

- [Comenzando con Liqueed](https://github.com/liquid-co-ops/liqueed/wiki/Starting-With-Liqueed)
- [Backlog](https://trello.com/b/mXIVvFaL/liqueed)

## References

- [LeanCoops – first draft](http://blog.agilar.org/index.php/2014/04/30/leancoops-first-draft/)

