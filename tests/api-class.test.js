var should = require('should'),
  API = require('../index.js'),
  _api = new API();

describe('Android Market Session', function () {
  it('Should have a request context', function (done) {
    _api.getContext.should.be.a.Function;
    _api.getContext().should.be.an.instanceof(API.RequestContext);
    done();
  });
  it('Should have defaults parameters for the request context', function (done) {
    var context = _api.getContext();
    context.getIsSecure().should.be.false;
    context.getVersion().should.be.equal(8013013);
    context.getDeviceAndSdkVersion().should.be.equal('crespo:15');
    context.getOperatorAlpha().should.be.equal('T-Mobile');
    context.getSimOperatorAlpha().should.be.equal('T-Mobile');
    context.getOperatorNumeric().should.be.equal('310260');
    context.getSimOperatorNumeric().should.be.equal('310260');
    context.getUserLanguage().should.be.equal('en');
    context.getUserCountry().should.be.equal('US');
    done();
  });
  it('Should be possible to set T-Mobile as operator', function (done) {
    var context = _api.getContext();
    _api.setOperatorTMobile.should.be.a.Function;
    _api.setOperatorTMobile();
    context.getOperatorAlpha().should.be.equal('T-Mobile');
    context.getSimOperatorAlpha().should.be.equal('T-Mobile');
    context.getOperatorNumeric().should.be.equal('310260');
    context.getSimOperatorNumeric().should.be.equal('310260');
    done();
  });
  it('Should be possible to set SFR as operator', function (done) {
    var context = _api.getContext();
    _api.setOperatorSFR.should.be.a.Function;
    _api.setOperatorSFR();
    context.getOperatorAlpha().should.be.equal('F SFR');
    context.getSimOperatorAlpha().should.be.equal('F SFR');
    context.getOperatorNumeric().should.be.equal('20810');
    context.getSimOperatorNumeric().should.be.equal('20810');
    done();
  });
  it('Should be possible to set O2 as operator', function (done) {
    var context = _api.getContext();
    _api.setOperatorO2.should.be.a.Function;
    _api.setOperatorO2();
    context.getOperatorAlpha().should.be.equal('o2 - de');
    context.getSimOperatorAlpha().should.be.equal('o2 - de');
    context.getOperatorNumeric().should.be.equal('26207');
    context.getSimOperatorNumeric().should.be.equal('26207');
    done();
  });
  it('Should be possible to set Simyo as operator', function (done) {
    var context = _api.getContext();
    _api.setOperatorSimyo.should.be.a.Function;
    _api.setOperatorSimyo();
    context.getOperatorAlpha().should.be.equal('E-Plus');
    context.getSimOperatorAlpha().should.be.equal('simyo');
    context.getOperatorNumeric().should.be.equal('26203');
    context.getSimOperatorNumeric().should.be.equal('26203');
    done();
  });
  it('Should be possible to set Sunrise as operator', function (done) {
    var context = _api.getContext();
    _api.setOperatorSunrise.should.be.a.Function;
    _api.setOperatorSunrise();
    context.getOperatorAlpha().should.be.equal('sunrise');
    context.getSimOperatorAlpha().should.be.equal('sunrise');
    context.getOperatorNumeric().should.be.equal('22802');
    context.getSimOperatorNumeric().should.be.equal('22802');
    done();
  });
  it('Should be possible to set locale', function (done) {
    var context = _api.getContext();
    _api.setLocale.should.be.a.Function;
    _api.setLocale('es', 'AR');
    context.getUserLanguage().should.be.equal('es');
    context.getUserCountry().should.be.equal('AR');
    done();
  });
  it('Should be possible to set locale', function (done) {
    var context = _api.getContext();
    _api.setLocale.should.be.a.Function;
    _api.setLocale('es', 'AR');
    context.getUserLanguage().should.be.equal('es');
    context.getUserCountry().should.be.equal('AR');
    done();
  });
  it('Should be possible to set auth subtoken', function (done) {
    var context = _api.getContext();
    _api.setAuthSubToken.should.be.a.Function;
    _api.setAuthSubToken('123456');
    context.getAuthSubToken().should.be.equal('123456');
    done();
  });
  it('Should be possible to set secure context', function (done) {
    var context = _api.getContext();
    _api.setIsSecure.should.be.a.Function;
    _api.setIsSecure(true);
    context.getIsSecure().should.be.true;
    _api.setIsSecure(false);
    context.getIsSecure().should.be.false;
    done();
  });
  it('Should be possible to set android id', function (done) {
    var context = _api.getContext();
    _api.setAndroidId.should.be.a.Function;
    _api.setAndroidId('123456');
    context.getAndroidId().should.be.equal('123456');
    done();
  });
});