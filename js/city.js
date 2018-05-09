//获取城市简码
var cityshort = Utils.getQueryString('cityshort') || 'bj';
var cityInfo = {
	'bj':{lng:116.4136103013,lat:39.9110666857},
	'sh':{lng:121.4803295328,lat:31.2363429624},
	'gz':{lng:113.2708136740,lat:23.1351666766},
	'sz':{lng:114.0661345267,lat:22.5485544122},
	'wz':{lng:120.7058617854,lat:28.0011792279},
	'fj':{lng:119.3030722518,lat:26.1059198357},
	'heb':{lng:126.5424184340,lat:45.8077839548},
	'zz':{lng:113.6313915479,lat:34.7533581487}
}
var citylng = cityInfo[cityshort].lng; //获取城市经度
var citylat = cityInfo[cityshort].lat; //获取城市纬度
//console.log(cityshort,citylng,citylat);
//初始化地图及图层
CityMaps.init(citylng,citylat);

//右上方的切换按钮点击事件
$('.tab-item').click(function(p){
	$(this).addClass('tab-item-active').siblings().removeClass('tab-item-active');
	var thisId = $(this)[0].id;
	if(thisId=='tab-xingyun'){ //1--星云图
		CityMaps.layerTag = layerTag.XINGYUN;
	}else if(thisId=='tab-yunli'){  //2--运力状态   //该效果需要两个图层（点、路线）
		CityMaps.layerTag = layerTag.YUNLI;
	}else if(thisId=='tab-gongxu'){  //3--供需热力
		CityMaps.layerTag = layerTag.GONGXU;
	}else if(thisId=='tab-lujing'){ //4--路径经脉
		CityMaps.layerTag = layerTag.LUJING;
	} 
	setDataFn();
})

// 四个接口
var apiUrl = {
	'XINGYUN': 'static/car.json', //蓝点--自己构造
	'YUNLI1': 'static/wuhan-car.js',
	'YUNLI2': 'static/wuhan-car.js',
	'GONGXU': 'static/car.json',  //热力图---构造
	'LUJING': 'static/car.json'   //直接可用
}


//setInterval(setDataFn, 3000)
setDataFn();
function setDataFn(){
	var layerTag = CityMaps.layerTag;
	//console.log('layerTag'+layerTag);
	var url = '';
	var mapOption1 = null;
	var mapOption2 = null;
	switch(layerTag){
		case 'xingyun':
			url = apiUrl.XINGYUN;
			mapOption1 = MapOptions.XINGYUN;
			CityMaps.mapLayers[0].mapvLayer.show();
			CityMaps.mapLayers[1].mapvLayer.hide();
			break;
		case 'yunli':
			url = apiUrl.YUNLI1;
			mapOption1 = MapOptions.YUNLI1;
			mapOption2 = MapOptions.YUNLI2;
			CityMaps.mapLayers[0].mapvLayer.show();  
			CityMaps.mapLayers[1].mapvLayer.show();
			break;
		case 'gongxu':
			url = apiUrl.GONGXU;
			mapOption1 = MapOptions.GONGXU;
			CityMaps.mapLayers[0].mapvLayer.show();
			CityMaps.mapLayers[1].mapvLayer.hide();
			break;
		case 'lujing':
			url = apiUrl.LUJING;
			mapOption1 = MapOptions.LUJING;
			CityMaps.mapLayers[0].mapvLayer.show();
			CityMaps.mapLayers[1].mapvLayer.hide();
			break;
	}
	
	if(layerTag=='xingyun'){
		xingyunFn(mapOption1,mapOption2);
		
	}else if(layerTag=='yunli'){
		$.ajax({
			type:"get",
			url:url,
			async:true,
			success: function(data){
				yunliFn(data,mapOption1,mapOption2);
				
			},
			error: function(){
				
			}
		});
		
	}else if(layerTag=='gongxu'){
		gongxuFn(mapOption1,mapOption2);
		
	}else if(layerTag=='lujing'){
		$.ajax({
			type:"get",
			url:url,
			async:true,
			success: function(data){
				CityMaps.updateLayerData(data,'',mapOption1,mapOption2)
			},
			error: function(){}
		});
		
	}

}


//临时构造数据
function xingyunFn(mapOption1,mapOption2){
	var data = [];
	var randomCount = 300;
    var citys = ["北京","天津","上海","重庆","石家庄","太原","呼和浩特","哈尔滨","长春","沈阳","济南","南京","合肥","杭州","南昌","福州","郑州","武汉","长沙","广州","南宁","西安","银川","兰州","西宁","乌鲁木齐","成都","贵阳","昆明","拉萨","海口"];
    // 构造数据
    while (randomCount--) {
        var cityCenter = mapv.utilCityCenter.getCenterByCityName(citys[parseInt(Math.random() * citys.length)]);
        data.push({
            geometry: {
                type: 'Point',
                coordinates: [cityCenter.lng - 2 + Math.random() * 4, cityCenter.lat - 2 + Math.random() * 4]
            },
            count: 30 * Math.random(),
            time: 100 * Math.random()
        });
    }
    CityMaps.updateLayerData(data,'',mapOption1,mapOption2)
}
function gongxuFn(mapOption1,mapOption2){
	var randomCount = 1000;
    var data = [];
    var citys = ["北京","天津","上海","重庆","石家庄","太原","呼和浩特","哈尔滨","长春","沈阳","济南","南京","合肥","杭州","南昌","福州","郑州","武汉","长沙","广州","南宁","西安","银川","兰州","西宁","乌鲁木齐","成都","贵阳","昆明","拉萨","海口"];
        // 构造数据
    while (randomCount--) {
        var cityCenter = mapv.utilCityCenter.getCenterByCityName(citys[parseInt(Math.random() * citys.length)]);
        data.push({
            geometry: {
                type: 'Point',
                coordinates: [cityCenter.lng - 2 + Math.random() * 4, cityCenter.lat - 2 + Math.random() * 4]
            },
            count: 30 * Math.random(),
            time: 100 * Math.random()
        });
    }
    CityMaps.updateLayerData(data,'',mapOption1,mapOption2)
}

function  yunliFn(rs,mapOption1,mapOption2){
	var data = [];
    var timeData = [];
    rs = rs.split("\n");
    var maxLength = 0;
    for (var i = 0; i < rs.length; i++) {
        var item = rs[i].split(',');
        var coordinates = [];
        if (item.length > maxLength) {
            maxLength = item.length;
        }
        for (j = 0; j < item.length; j += 2) {
            coordinates.push([item[j], item[j + 1]]);
            timeData.push({
                geometry: {
                    type: 'Point',
                    coordinates: [item[j], item[j + 1]]
                },
                count: 1,
                time: j
            });
        }
        data.push({
            geometry: {
                type: 'LineString',
                coordinates: coordinates
            }
        });
    }
    
    console.log(timeData)
    CityMaps.updateLayerData(data,timeData,mapOption1,mapOption2)
    
}



//头部时间的动态显示
//Utils.minuteTimer($('#time-show'));
//左侧数据的动态变化效果
//updateLeftDatas(cityshort);
function updateLeftDatas1(cityshort){
	var url = "http://rap2api.taobao.org/app/mock/12662/map/big_number?city=bj&timestamp=1525747088"
	var countUpOptions = {
		useEasing: false, 
		useGrouping: true, 
		separator: ',' 
	};
	
	var countUpDomArr = $('.data-number'); //左侧六个数据的Dom容器数组
	var countUpObjArr = []; //用于存放6个countUp对象的数组
//	setInterval(function(){
//		getSixNums(url,countUpDomArr, countUpOptions,countUpObjArr);
//	},3000)
	getSixNums(url,countUpDomArr, countUpOptions,countUpObjArr);
}
//左侧6个数的，请求接口
function getSixNums(url,countUpDomArr, countUpOptions,countUpObjArr){
	$.ajax({
		type:"get",
		url:url,
		async:true,
		success:function(res){
			if(res.ret_code==1000){
				var startArr = res.data.before;
				var endArr = res.data.current;
				if(countUpObjArr.length==0){//第一次,需创建CountUp对象
					$.each(countUpDomArr,function(idx,val,arr){
						var countUpObj = new CountUp(val.id, startArr[idx], endArr[idx], 0, 4, countUpOptions);
						if (!countUpObj.error) {
							countUpObjArr.push(countUpObj);
						} else {
							console.error(countUpObj.error);
						}
					})
				}else if(countUpObjArr.length==6){//后续定时更新数据
					$.each(countUpDomArr,function(idx,val,arr){
						countUpObjArr[idx].update(endArr[idx])
					})
				}else{
					console.log('创建CountUp对象异常);
				}
			}else{
				console.log(res.ret_code)
			}
		},
		error:function(err){
			console.log(err)	
		}
	});
}