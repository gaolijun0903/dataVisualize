
//mapv图层配置
var MapLayerOptions = {
	'XINGYUN':{
        fillStyle: 'rgba(255, 250, 50, 0.6)',// 填充颜色-- 点数据时候使用
        size: 3,// 填充点大小值
        draw: 'simple',
        animation: {
            type: 'time',// 按时间展示动画
            stepsRange: {// 动画时间范围,time字段中值
                start: 0,
                end: 10
            },
            trails: 1,// 时间动画的拖尾大小
            duration: 5,// 单个动画的时间，单位秒
        }
    },
	'YUNLI1':{
        strokeStyle: 'rgba(53,57,255,0.5)',// 描边颜色--线数据时候使用
        coordType: 'bd09mc',// 可选百度墨卡托坐标类型bd09mc和百度经纬度坐标类型bd09ll(默认)
        shadowColor: 'rgba(53,57,255,0.2)',
        shadowBlur: 3,
        lineWidth: 3.0,
        draw: 'simple'
    },
	'YUNLI2':{
        fillStyle: 'rgba(255, 250, 250, 0.2)',// 填充颜色
        coordType: 'bd09mc',
        globalCompositeOperation: "lighter",// 颜色叠加方式
        size: 1.5,
        animation: {
            stepsRange: {
                start: 0,
                end: 10
            },
            trails: 1,
            duration: 5,
        },
        draw: 'simple'
    },
	'GONGXU':{
        size: 13, // 每个热力点半径大小
        gradient: { 0.25: "rgb(0,0,255)", 0.35: "rgb(0,255,0)", 0.75: "yellow", 1.0: "rgb(255,0,0)"},// 热力图渐变色
        max: 40,  // 最大权重值，根据上面配置用以计算它的热度
        animation: {
            type: 'time',// 按时间展示动画
            stepsRange: {// 动画时间范围,time字段中值
                start: 0,
                end: 10
            },
            trails: 1,// 时间动画的拖尾大小
            duration: 5,// 单个动画的时间，单位秒
        },
        draw: 'heatmap'
    },
	'LUJING':{
        strokeStyle: 'rgba(50, 50, 255, 0.8)',// 描边颜色
        lineWidth: 0.05,
        globalCompositeOperation: 'lighter',// 颜色叠加方式
        draw: 'simple'
    }
};
//地图的自定义样式 	
var MapStyle = {
    styleJson: [ {"featureType":"water","elementType":"all","stylers":{"color":"#044161"}},
    {"featureType":"land","elementType":"all","stylers":{"color":"#091934"}},
    {"featureType":"boundary","elementType":"geometry","stylers":{"color":"#064f85"}},
    {"featureType":"railway","elementType":"all","stylers":{"visibility":"off"}},
    {"featureType":"highway","elementType":"geometry","stylers":{"color":"#004981"}},
    {"featureType":"highway","elementType":"geometry.fill","stylers":{"color":"#005b96","lightness":1}},
    {"featureType":"highway","elementType":"labels","stylers":{"visibility":"on"}},
    {"featureType":"arterial","elementType":"geometry","stylers":{"color":"#004981","lightness":-39}},
    {"featureType":"arterial","elementType":"geometry.fill","stylers":{"color":"#00508b"}},
    {"featureType":"poi","elementType":"all","stylers":{"visibility":"off"}},
    {"featureType":"green","elementType":"all","stylers":{"color":"#056197","visibility":"off"}},
    {"featureType":"subway","elementType":"all","stylers":{"visibility":"off"}},
    {"featureType":"manmade","elementType":"all","stylers":{"visibility":"off"}},
    {"featureType":"local","elementType":"all","stylers":{"visibility":"off"}},
    {"featureType":"arterial","elementType":"labels","stylers":{"visibility":"off"}},
    {"featureType":"boundary","elementType":"geometry.fill","stylers":{"color":"#029fd4"}},
    {"featureType":"building","elementType":"all","stylers":{"color":"#1a5787"}},
    {"featureType":"label","elementType":"all","stylers":{"visibility":"off"}},
    {"featureType":"poi","elementType":"labels.text.fill","stylers":{"color":"#ffffff"}},
    {"featureType":"poi","elementType":"labels.text.stroke","stylers":{"color":"#1e1c1c"}},
    {"featureType":"administrative","elementType":"labels","stylers":{"visibility":"off"}},
    {"featureType":"road","elementType":"labels","stylers":{"visibility":"off"}} ]
}

function CityMaps (cityshort,lng,lat) {
	this.map = null; //地图对象
	this.cityshort = cityshort;  //城市简称
	this.lng = lng;  //经度
	this.lat = lat;  //纬度
	this.Layers = {  //地图图层
		xingyunLayer:'', //星云图-图层
		yunliLayer1:'', //运力图-图层1--路线层
		yunliLayer2:'', //运力图-图层2--定位点层
		gongxuLayer:'', //供需热力图-图层
		lujingLayer:'' //路径脉络-图层
	};
	this.mapLayerOptions = MapLayerOptions; //各图层基本配置信息
	this.urlDomain = 'https://10.0.11.41:9999/visual';  //图层数据接口的域名
	this.urlQuery = '/'+cityshort+'/'+Utils.timestamp(); //图层数据接口的请求参数
	this.apiUrl = { //各图层数据接口
		'XINGYUN':this.urlDomain+ 'xingyun' +this.urlQuery, //蓝点--自己构造
		'YUNLI': this.urlDomain+ 'yunli' +this.urlQuery,
		'GONGXU': this.urlDomain+ 'gongxu' +this.urlQuery,  //热力图---构造
		'LUJING': this.urlDomain+ 'lujing' +this.urlQuery   //直接可用
	};
	this.allDataOver = false;  //是否全部图层的数据都加载完毕
}

CityMaps.prototype.init = function(cb){ //初始化地图实例和图层
	this.initBmap(this.lng,this.lat);
	this.initLayers(cb);
};
CityMaps.prototype.initBmap = function(lng,lat){
	this.map = new BMap.Map("map", { enableMapClick: false}); // 创建地图实例  
	this.map.centerAndZoom(new BMap.Point(lng, lat), 6);  // 初始化地图，设置中心点坐标和地图级别  
	this.map.enableScrollWheelZoom(true);  // 开启鼠标滚轮缩放
	this.map.setMapStyle(MapStyle);  // 设置地图的自定义样式 
};
CityMaps.prototype.initLayers = function(cb){ //初始化图层，支持参数-全部图层创建完成后的回调函数
	var self = this;
	//$.when用来并行运行多个异步任务
	$.when(this.xingyun(), this.yunli(), this.gongxu(), this.lujing())
	.then(function(data1, data2, data3,data4){
	    //console.log('全部执行完成');
	    self.allDataOver = true;  //全部图层的数据都加载完毕
	    self.switchLayer('xingyun');  //默认显示星云图显示
	    if(cb){//如果有回调函数，执行
	    	cb();
	    }
	});
};
CityMaps.prototype.updateLayerData= function(){ //更新数据
	this.xingyun(true);
	this.yunli(true);
	this.gongxu(true);
	this.lujing(true);
};
CityMaps.prototype.switchLayer=function(layerTag){//图层切换--参数
	switch(layerTag){
		case 'xingyun':
			this.Layers.xingyunLayer.show();
			this.Layers.yunliLayer1.hide();
			this.Layers.yunliLayer2.hide();
			this.Layers.gongxuLayer.hide();
			this.Layers.lujingLayer.hide();
			break;
		case 'yunli':
			this.Layers.xingyunLayer.hide();
			this.Layers.yunliLayer1.show();
			this.Layers.yunliLayer2.show();
			this.Layers.gongxuLayer.hide();
			this.Layers.lujingLayer.hide();
			break;
		case 'gongxu':
			this.Layers.xingyunLayer.hide();
			this.Layers.yunliLayer1.hide();
			this.Layers.yunliLayer2.hide();
			this.Layers.gongxuLayer.show();
			this.Layers.lujingLayer.hide();
			break;
		case 'lujing':
			this.Layers.xingyunLayer.hide();
			this.Layers.yunliLayer1.hide();
			this.Layers.yunliLayer2.hide();
			this.Layers.gongxuLayer.hide();
			this.Layers.lujingLayer.show();
			break;
	}
};
CityMaps.prototype.xingyun=function (isUpdate){ //星云图，参数-是用来 初始化or更新
	var self = this;
	var def = $.Deferred();
	//console.log(this.apiUrl.XINGYUN)
    setTimeout(function(){
    	var data = self.createData();
		if(isUpdate){// 更新数据
	    	self.Layers.xingyunLayer.dataSet.set(data);
	    	return
		}
	    var dataSet = new mapv.DataSet(data);
	    self.Layers.xingyunLayer = new mapv.baiduMapLayer(self.map, dataSet, self.mapLayerOptions.XINGYUN);
	    self.Layers.xingyunLayer.hide();
        //console.log('1xingyun-执行完成');
        def.resolve('1xingyun数据');
    }, 500);
	return def.promise();	//返回一个受限的Deferred对象
};
CityMaps.prototype.yunli=function (isUpdate){ //运力图
	var self = this;
	var def = $.Deferred();
	//console.log(this.apiUrl.YUNLI)
	$.get('static/wuhan-car.js', function (rs) {
        var data = [];
        var timeData = [];
        rs = rs.split("\n");
        //console.log(rs.length);
        for (var i = 0; i < rs.length; i++) {
            var item = rs[i].split(',');
            var coordinates = [];
            for (j = 0; j < item.length; j += 2) {
                coordinates.push([item[j], item[j + 1]]);
                timeData.push({
                    geometry: {
                        type: 'Point',
                        coordinates: [item[j], item[j + 1]]
                    },
                    time: j/10
                });
            }
            data.push({
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates
                }
            });
        }
		if(isUpdate){// 更新数据
        	self.Layers.yunliLayer1.dataSet.set(data);
        	self.Layers.yunliLayer2.dataSet.set(timeData);
        	return
		}
        var dataSet1 = new mapv.DataSet(data);
        self.Layers.yunliLayer1 = new mapv.baiduMapLayer(self.map, dataSet1, self.mapLayerOptions.YUNLI1);
    	self.Layers.yunliLayer1.hide();

        var dataSet2 = new mapv.DataSet(timeData);
        self.Layers.yunliLayer2 = new mapv.baiduMapLayer(self.map, dataSet2, self.mapLayerOptions.YUNLI2);
    	self.Layers.yunliLayer2.hide();
    	
    	//console.log('2yunli-执行完成');
        def.resolve('2yunli数据');
    });
	return def.promise();	
};
CityMaps.prototype.gongxu=function (isUpdate){//供需热力图
	var self = this;
	var def = $.Deferred();
	//console.log(this.apiUrl.GONGXU)
    setTimeout(function(){
    	var data = self.createData();
		if(isUpdate){// 更新数据
	    	self.Layers.gongxuLayer.dataSet.set(data);
	    	return
		}
	    var dataSet = new mapv.DataSet(data);
	    self.Layers.gongxuLayer = new mapv.baiduMapLayer(self.map, dataSet, self.mapLayerOptions.GONGXU);
	    self.Layers.gongxuLayer.hide();
        //console.log('3-gongxu执行完成');
        def.resolve('3-gongxu数据');
    }, 2500);
	return def.promise();	
		
};
CityMaps.prototype.lujing=function (isUpdate){ //路径脉络图
	var self = this;
	var def = $.Deferred();
	//console.log(this.apiUrl.LUJING)
	$.get('static/car.json', function(csvstr) {
		var data = csvstr;
		if(isUpdate){// 更新数据
        	self.Layers.lujingLayer.dataSet.set(data);
        	return
		}
        var dataSet = new mapv.DataSet(data);
        self.Layers.lujingLayer = new mapv.baiduMapLayer(self.map, dataSet, self.mapLayerOptions.LUJING);
    	self.Layers.lujingLayer.hide();
		//console.log('4-lujing执行完成');
        def.resolve('4-lujing数据');
   });
   return def.promise();	
};
CityMaps.prototype.createData=function (){// 点数据构造数据
  	var randomCount = 1000;
    var data = [];
    var citys = ["北京","天津","上海","重庆","石家庄","太原","呼和浩特","哈尔滨","长春","沈阳","济南","南京","合肥","杭州","南昌","福州","郑州","武汉","长沙","广州","南宁","西安","银川","兰州","西宁","乌鲁木齐","成都","贵阳","昆明","拉萨","海口"];
    
    while (randomCount--) {
        var cityCenter = mapv.utilCityCenter.getCenterByCityName(citys[parseInt(Math.random() * citys.length)]);
        data.push({
            geometry: {
            	type: 'Point',
                coordinates: [cityCenter.lng - 2 + Math.random() * 4, cityCenter.lat - 2 + Math.random() * 4]
            },
            count: 30 * Math.random(),
            time: 10 * Math.random()
        });
    }
    return data;
} 
	