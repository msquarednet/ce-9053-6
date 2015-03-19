1) make sure to start mongod.

If on cloud9 mongod --nojournal

    1  npm init
    2  npm install jasmine-node --save-dev
    3  mkdir spec
    4  mkdir spec/models
    5  touch spec/models/models_spec.js
    6  jasmine-node spec/
    7  mkdir models
    8  touch models/models.js
    9  jasmine-node spec/
   10  mkdir config
   11  touch config/db.js
   12  jasmine-node spec/
   13  npm install mongoose --save
   14  jasmine-node spec/
   15  git status
   16  git add .
   17  git commit -m 'setting things up'
   18  git push origin
   19  git add .
   20  git push origin
   21  git status
   22  git add .
   23  git commit -m 'fix readme'
   24  git push origin
   25  jasmine-node spec
   26  touch hello.js
   27  node hello
   28  MSG=hello node hello
   29  MSG=bye node hello
   30  CONN=mongodb://localhost/my_world_test2 jasmine-node spec/
   31  CONN=mongodb://localhost/my_world_test3 jasmine-node spec/
   32  git add .
   33  git commit -m 'person works'
   34  git push origin
   35  CONN=mongodb://localhost/my_world_test3 jasmine-node spec/
   36  git add .
   37  git commit -m 'start things'
   38  git push origin
   39  CONN=mongodb://localhost/my_world_test3 jasmine-node spec/
   40  git add .
   41  git commit -m 'getonebyname'
   42  git push origin
   43  CONN=mongodb://localhost/my_world_test3 jasmine-node spec/
   44  git status
   45  git add .
   46  git commit -m 'thing methods'
   47  git push origin
   48  CONN=mongxxodb://localhost/my_world_test3 jasmine-node spec/
   49  CONN=mongodb://localhost/my_world_test3 jasmine-node spec/
   50  CONN=mongodb://localhost/my_world_test3 jasmine-node spec/ --captureExceptions
   51  git add .
   52  git commit 'getAll for things'
   53  git commit -m 'getAll for things'
   54  git push origin
   55  CONN=mongodb://localhost/my_world_test3 jasmine-node spec/ --captureExceptions
   56  git status
   57  git add .
   58  git commit -m 'acquire'
   59  git push origin
   60  history
   61  history -v
   62  history# ce-9053-6
# ce-9053-6
