var ProtoBuf = require('protobufjs'),
  builder = ProtoBuf.loadJsonFile({ root: __dirname, file: 'proto/market.json' }),
  request = require('request'),
  zlib = require('zlib'),
  PROTOCOL_VERSION = 2;

exports = module.exports = MarketSession;
exports.RequestContext = RequestContext = builder.build('RequestContext');
exports.AppType = AppType = builder.build('AppType');
exports.ViewType = ViewType = builder.build('ViewType');
exports.Request = Request = builder.build('Request');
exports.Response = Response = builder.build('Response');
exports.AppsRequest = AppsRequest = builder.build('AppsRequest');
exports.AppsResponse = AppsResponse = builder.build('AppsResponse');
exports.CategoriesRequest = CategoriesRequest = builder.build('CategoriesRequest');
exports.CategoriesResponse = CategoriesResponse = builder.build('CategoriesResponse');
exports.SubCategoriesRequest = SubCategoriesRequest = builder.build('SubCategoriesRequest');
exports.SubCategoriesResponse = SubCategoriesResponse = builder.build('SubCategoriesResponse');
exports.CommentsRequest = CommentsRequest = builder.build('CommentsRequest');
exports.CommentsResponse = CommentsResponse = builder.build('CommentsResponse');
exports.GetAssetRequest = GetAssetRequest = builder.build('GetAssetRequest');
exports.GetAssetResponse = GetAssetResponse = builder.build('GetAssetResponse');
exports.GetImageRequest = GetImageRequest = builder.build('GetImageRequest');
exports.GetImageResponse = GetImageResponse = builder.build('GetImageResponse');

function MarketSession(options) {
  options = options || {};
  this.currentRequest = new Request();
  this.context = new RequestContext();
  this.context.setIsSecure(false);
  this.context.setVersion(8013013);
  this.context.setDeviceAndSdkVersion('crespo:15');
  this
    .setLocale('en', 'US')
    .setOperatorTMobile();
}

MarketSession.prototype.getContext = function() {
  return this.context;
};

MarketSession.prototype.setLocale = function(language, country) {
  this.context.setUserLanguage(language);
  this.context.setUserCountry(country);
  return this;
};

MarketSession.prototype.setOperator = function(operatorAlpha, simOperatorAlpha, operatorNumeric, simOperatorNumeric) {
  if (!operatorNumeric && !simOperatorNumeric) {
    operatorNumeric = simOperatorNumeric = simOperatorAlpha;
    simOperatorAlpha = operatorAlpha;
  }
  this.context.setOperatorAlpha(operatorAlpha);
  this.context.setSimOperatorAlpha(simOperatorAlpha);
  this.context.setOperatorNumeric(operatorNumeric);
  this.context.setSimOperatorNumeric(simOperatorNumeric);
  return this;
};

MarketSession.prototype.setOperatorTMobile = function() {
  this.setOperator('T-Mobile', '310260');
  return this;
};

MarketSession.prototype.setOperatorSFR = function() {
  this.setOperator('F SFR', '20810');
  return this;
};

MarketSession.prototype.setOperatorO2 = function() {
  this.setOperator('o2 - de', '26207');
  return this;
};

MarketSession.prototype.setOperatorSimyo = function() {
  this.setOperator('E-Plus', 'simyo', '26203', '26203');
  return this;
};

MarketSession.prototype.setOperatorSunrise = function() {
  this.setOperator('sunrise', '22802');
  return this;
};

MarketSession.prototype.setAuthSubToken = function(authSubToken) {
  this.context.setAuthSubToken(authSubToken);
  return this;
};

MarketSession.prototype.setIsSecure = function(secure) {
  this.context.setIsSecure(secure);
  return this;
};

MarketSession.prototype.setAndroidId = function(id) {
  this.context.setAndroidId(id);
  return this;
};

MarketSession.prototype.login = function(email, password, androidId, options, done) {
  if (typeof(options) == 'function') {
    done = options;
    options = {};
  }
  options = options || {};
  this.setAndroidId(androidId);
  var _self = this;
  request.post('https://www.google.com/accounts/ClientLogin', { form: {
    Email: email,
    Passwd: password,
    service: options.service || 'android',
    accountType: options.accountType || 'HOSTED_OR_GOOGLE'
  }}, function (err, response, body) {
    if (err) {
      return done(err);
    }
    var data = tokensSplit(body);
    if (data.Error) {
      err = new Error(data.Error);
      err.code = response.statusCode;
      return done(err);
    }
    if (data.Auth) {
      _self.setAuthSubToken(data.Auth);
      return done(null);
    }
    done(new Error('Auth key not found'));
  });
};
MarketSession.prototype.query = function(req, done) {
  var r = new Request(), rg = new Request.RequestGroup(),
    responseName, responseClass;
  if (req instanceof AppsRequest) {
    rg.setAppsRequest(req);
    responseName = 'appsResponse';
  }
  if (req instanceof CategoriesRequest) {
    rg.setCategoriesRequest(req);
    responseName = 'categoriesResponse';
  }
  if (req instanceof SubCategoriesRequest) {
    rg.setSubCategoriesRequest(req);
    responseName = 'subCategoriesResponse'; 
  }
  if (req instanceof CommentsRequest) {
    rg.setCommentsRequest(req);
    responseName = 'commentsResponse'; 
  }
  if (req instanceof GetAssetRequest) {
    rg.setGetAssetRequest(req);
    responseName = 'getAssetResponse'; 
  }
  if (req instanceof GetImageRequest) {
    rg.setImageRequest(req);
    responseName = 'imageResponse'; 
  }
  r.add('requestgroup', rg);
  r.setContext(this.context);
  executeProtobuf(r, function (err, response) {
    if (err) return done(err);
    done(null, response.responsegroup[0][responseName]);
  });
};

function tokensSplit(data) {
  var lines = data.match(/[^\r\n]+/g),
    tokens = {};
  for (var i = 0; i < lines.length; i++) {
    var parts = lines[i].split('=');
    tokens[parts[0]] = parts[1];
  }
  return tokens;
}

function executeProtobuf(req, done) {
  request({
    url: 'http' + (req.getContext().getIsSecure() ? 's' : '') + '://android.clients.google.com/market/api/ApiRequest',
    method: 'POST',
    headers: {
      'Cookie': 'ANDROID=' + req.getContext().AuthSubToken,
      'User-Agent': 'Android-Finsky/3.7.13 (api=3,versionCode=8013013,sdk=15,device=crespo,hardware=herring,product=soju); gzip'
    },
    encoding: null,
    form: {
      version: PROTOCOL_VERSION,
      request: req.toBase64()
    }
  }, function(err, response, body) {
    if (err) return done(err);
    if (response.statusCode !== 200) {
      err = new Error();
      err.code = response.statusCode;
      return done(err);
    }
    zlib.gunzip(body, function(err, dezipped) {
      done(err, Response.decode(dezipped));
    });
  });
}