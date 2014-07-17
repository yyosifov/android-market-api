var _config = require('./settings.json'),
  API = require('../index.js'),
  _api = new API();

describe('Android Market Communication', function() {
  this.timeout(5000);
  describe('Login', function() {
    it('Should be possible to login', function(done) {
      _api.login.should.be.a.Function;
      _api.login(_config.email, _config.password, _config.android_id, function (err) {
        (err === null).should.be.true;
        _api.getContext().getAuthSubToken().should.be.ok;
        done();
      });
    });
    it('Should return proper error on bad credentials', function(done) {
      _api.login('foo', 'bar', '000000', function (err) {
        err.should.be.ok;
        done();
      });
    });
  });
  describe('Simple queries', function() {
    before(function (done) {
      _api.login(_config.email, _config.password, _config.android_id, done);
    });
    it('Should make AppsRequest', function(done) {
      var r = new API.AppsRequest();
      r.setAppType(API.AppType.GAME)
      r.setStartIndex(1)
      r.setEntriesCount(10)
      r.setWithExtendedInfo(true)
      r.setViewType(API.AppsRequest.ViewType.FREE);
      _api.query(r, function(err, response) {
        (err === null).should.be.true;
        response.app.should.be.an.Array;
        done();
      });
    });
    it('Should make CategoriesRequest', function(done) {
      var r = new API.CategoriesRequest();
      _api.query(r, function(err, response) {
        (err === null).should.be.true;
        response.categories.should.be.an.Array;
        done();
      });
    });
    it('Should make CommentsRequest', function(done) {
      var r = new API.CommentsRequest();
      r.setAppId('com.google.android.googlequicksearchbox');
      r.setStartIndex(0);
      r.setEntriesCount(10);
      _api.query(r, function(err, response) {
        (err === null).should.be.true;
        response.comments.should.be.an.Array;
        done();
      });
    });
    it('Should make GetAssetRequest', function(done) {
      var r = new API.GetAssetRequest();
      r.setAssetId('com.google.android.googlequicksearchbox');
      _api.query(r, function(err, response) {
        (err === null).should.be.true;
        response.installasset.should.be.an.Array;
        done();
      });
    });
    it('Should make GetImageRequest', function(done) {
      var r = new API.GetImageRequest();
      r.setAppId('com.google.android.googlequicksearchbox');
      _api.query(r, function(err, response) {
        (err === null).should.be.true;
        response.imageData.should.be.an.Object;
        done();
      });
    });
  })
});