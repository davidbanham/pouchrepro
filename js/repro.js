var db = null
var dbname = "idb://replicationrepro"

var loadPouch = function() {
  Pouch(dbname, function(err, pouchdb) {
    db = pouchdb;
  });
};

window.addEventListener('load', loadPouch, false);

var push = function() {
  Pouch.replicate(dbname, "https://davidbanham.iriscouch.com:6984/replicationrepro", function(err, resp) {
    console.log("err is", err);
    console.log("resp is", resp);
  });
};

var addRecord = function(times) {
  if (typeof times === 'undefined') times = 1;
  for ( var i = 0; i < times; i++ ) {
    times--;
    db.post({rand: Math.floor(Math.random() * (1 << 24)).toString(16)}, function(err, res) {
      if (err) { console.error(err) }
      db.allDocs({include_docs: true}, function(err, res) {
        console.log("db is now", res);
      });
    })
  }
};

var destroy = function() {
  Pouch.destroy(dbname, function(err) {
    console.log("database destroyed with err:", err);
  });
};

var deleteItem = function() {
  db.allDocs({include_docs: true}, function(err, res) {
    record = res.rows[0].doc
    db.remove(record, function(err, res) {
      if (err) console.error("Error deleting item", err);
      console.log("Removed item", record);
    });
  });
};
