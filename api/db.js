//. app.js

var express = require( 'express' ),
    bodyParser = require( 'body-parser' ),
    fs = require( 'fs' ),
    multer = require( 'multer' ),
    router = express();
var settings = require( '../settings' );

if( settings.memdb ){
  router._docs = {};
}

router.use( bodyParser.urlencoded( { extended: true } ) );
router.use( bodyParser.json() );

router.createDoc = function( doc ){
  if( !doc.id ){
    doc.id = generatedId();
  }
  if( typeof doc.id == 'integer' ){
    doc.id = '' + doc.id;
  }
  if( router._docs[doc.id] ){
    return { status: 400, error: 'doc id = ' + doc.id + ' existed.' };
  }else{
    var ts = ( new Date() ).getTime();
    doc.created = ts;
    doc.updated = ts;
    router._docs[doc.id] = doc;
    return { status: 200, doc: doc };
  }
};

router.getDoc = function( id ){
  if( id ){
    if( router._docs[id] ){
      return { status: 200, doc: router._docs[id] };
    }else{
      return { status: 400, error: 'doc id = ' + id + ' not found.' };
    }
  }else{
    return { status: 400, error: 'parameter id needed.' };
  }
};

router.getDocs = function( limit, offset ){
  var docs = [];
  Object.keys( router._docs ).forEach( function( id ){
    docs.push( router._docs[id] );
  });

  offset = ( offset ? offset : 0 );
  if( limit ){
    docs = docs.slice( offset, offset + limit );
  }else if( offset ){
    docs = docs.slice( offset );
  }

  return { status: 200, limit: limit, offset: offset, docs: docs };
}

router.updateDoc = function( doc ){
  if( !doc.id ){
    return { status: 400, error: 'parameter id needed.' };
  }else{
    if( router._docs[doc.id] ){
      var old_doc = router._docs[doc.id];
      var ts = ( new Date() ).getTime();
      doc.created = old_doc.created;
      doc.updated = ts;
      router._docs[doc.id] = doc;
      return { status: 200, doc: doc };
    }else{
      return { status: 400, error: 'doc id = ' + doc.id + ' not found.' };
    }
  }
};

router.deleteDoc = function( id ){
  if( !id ){
    return { status: 400, error: 'parameter id needed.' };
  }else{
    if( router._docs[id] ){
      delete router._docs[id];
      return { status: 200 };
    }else{
      return { status: 400, error: 'doc id = ' + id + ' not found.' };
    }
  }
};

router.post( '/doc', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  if( req.body ){
    var params = req.body;

    var r = router.createDoc( params );
    res.status( r.status );
    res.write( JSON.stringify( r, null, 2 ) );
    res.end();
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: 400, error: 'no object found.' } ) );
    res.end();
  }
});

router.get( '/doc/:id', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var id = req.params.id;
  if( id ){
    var r = router.getDoc( id );
    res.status( r.status );
    res.write( JSON.stringify( r, null, 2 ) );
    res.end();
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: 400, error: 'no parameter id found.' } ) );
    res.end();
  }
});

router.get( '/docs', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var limit = ( req.query.limit ? parseInt( req.query.limit ) : 10 );
  var offset = ( req.query.offset ? parseInt( req.query.offset ) : 0 );

  var r = router.getDocs( limit, offset );
  res.status( r.status );
  res.write( JSON.stringify( r, null, 2 ) );
  res.end();
});

router.put( '/doc/:id', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var id = req.params.id;
  if( id ){
    if( req.body ){
      var doc = req.body;
      doc.id = id;

      var r = router.updateDoc( doc );
      res.status( r.status );
      res.write( JSON.stringify( r, null, 2 ) );
      res.end();
    }else{
      res.status( 400 );
      res.write( JSON.stringify( { status: 400, error: 'no object found.' } ) );
      res.end();
    }
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: 400, error: 'no parameter id found.' } ) );
    res.end();
  }
});

router.delete( '/doc/:id', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var id = req.params.id;
  if( id ){
    var r = router.deleteDoc( id );
    res.status( r.status );
    res.write( JSON.stringify( r, null, 2 ) );
    res.end();
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: 400, error: 'no parameter id found.' } ) );
    res.end();
  }
});

function generateId(){
  var s = 1000;
  var id = '' + ( new Date().getTime().toString(16) ) + Math.floor( s * Math.random() ).toString(16);

  return id;
}


module.exports = router;
