
describe('storage', function(){
  var storage = require('storage');
  var assert = require('assert');
  var store = require('store');
  var docs;

  beforeEach(function(){
    docs = storage('docs');
    store(null);
  });

  afterEach(function(){
    docs.events.unbind();
  })

  it('should set `key`, `value` with namespace "docs:"', function(){
    docs('key', 'value');
    assert('value' == store('docs:key'));
  })

  it('should get `key`, with namespace `docs:`', function(){
    docs('key', 'value');
    assert('value' == docs('key'));
  })

  it('should remove all "docs:" when called with `null`', function(){
    store('baz', 'foo');
    docs('baz', 'foo');
    docs(null);
    assert(null == docs('baz'));
    assert('foo' == store('baz'));
  })

  it('should get all "docs:" when called with no arguments', function(){
    docs('a', [1]);
    docs('b', 2);
    docs('c', 3);

    assert(1 == docs().a[0]);
    assert(2 == docs().b);
    assert(3 == docs().c);
  })

  it('should call fn when values change', function(done){
    docs(called);
    set({ a: 1, b: 2 });


    function called(e){
      called.times = called.times || 0;
      ++called.times;
      assert(null == e.previous);
      assert(called.times == e.current);
      if (2 == called.times) done();
    }
  })

  it('should call fn when key changes', function(done){
    docs('a', called);
    set({ a: 1, b: 2 });

    function called(e){
      if (called.called) throw Error('boom');
      called.called = true;
      assert('a' == e.key);
      assert(1 == e.current);
      assert(1 == e.newValue);
      done();
    }
  })

  it('should parse `.previous` and `.current`', function(done){
    docs('a', called);
    set({ a: [1] });
    set({ a: [2] });

    function called(e){
      called.times = called.times || 0;
      if (2 != ++called.times) return;
      assert(1 == e.previous[0]);
      assert(2 == e.current[0]);
      done();
    }
  })

  function set(obj){
    for (var k in obj) obj['docs:' + k] = obj[k];
    var iframe = document.createElement('iframe');
    iframe.src = 'javascript:;';
    document.body.appendChild(iframe);
    var js = iframe.contentDocument.createElement('script')
    iframe.contentDocument.set = obj;
    iframe.style.display = 'none';
    js.textContent = 'for (var k in document.set) localStorage[k] = JSON.stringify(document.set[k]);';
    iframe.contentDocument.body.appendChild(js);
  }
});
