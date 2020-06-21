var sentinelCollection = ee.ImageCollection("COPERNICUS/S2_SR"),
    tRegion = 
    /* color: #0b4a8b */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[35.35335761602766, 36.88078541212022],
          [35.35335761602766, 36.85029661380377],
          [35.40554267462141, 36.85029661380377],
          [35.40554267462141, 36.88078541212022]]], null, false);

// MATRIX INFO

//a1 - a2 ->  45,00 degree
//b1 - b2 ->   0,00 degree
//c1 - c2 -> 135,00 degree
//d1 - d2 ->  90,00 degree
//e1 - e2 ->  22,50 degree
//f1 - f2 -> 112,50 degree
//g1 - g2 ->  11,25 degree
//h1 - h2 -> 101,25 degree
//i1 - i2 ->  33,75 degree
//j1 - j2 -> 123,75 degree
//k1 - k2 ->  56,25 degree
//l1 - l2 -> 146,25 degree
//m1 - m2 ->  67,50 degree
//n1 - n2 -> 157,50 degree
//o1 - o2 ->  78,75 degree
//p1 - p2 -> 168,75 degree

// Center the region
Map.centerObject(tRegion);

// Threshold
var T = ee.Number(100);  //this is pixel value

// ConnectedComponents Parameters
var ec = true;                   //eightConnected
var CT = ee.Number(200);         //this is m2
var ConnectedComponents = false; //if true it applies Connected Component analysis after each directional matrix
                                 //Lately, turning this to true helps if you decrease above threshold. 

// GET MONTHLY MEAN IMAGES
{
/* Taking May - June - July - August
// FEBRUARY
var sentinelFeb = ee.ImageCollection(sentinelCollection
  .filterBounds(tRegion)
  .filterDate('2019-02-01', '2019-03-01')
  .select(['B8','B11','B12']))
  .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 20));

var FebMean = sentinelFeb.reduce(ee.Reducer.mean());

// MARCH
var sentinelMarch = ee.ImageCollection(sentinelCollection
  .filterBounds(tRegion)
  .filterDate('2019-03-01', '2019-04-01')
  .select(['B8','B11','B12']))
  .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 20));

var MarchMean = sentinelMarch.reduce(ee.Reducer.mean());

// APRIL
var sentinelApril = ee.ImageCollection(sentinelCollection
  .filterBounds(tRegion)
  .filterDate('2019-04-01', '2019-05-01')
  .select(['B8','B11','B12']))
  .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 20));

var AprilMean = sentinelApril.reduce(ee.Reducer.mean());
*/
// MAY
var sentinelMay = ee.ImageCollection(sentinelCollection
  .filterBounds(tRegion)
  .filterDate('2019-05-01', '2019-06-01')
  .select(['B8','B11','B12']))
  .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 20));

var MayMean = sentinelMay.reduce(ee.Reducer.mean());

// JUNE
var sentinelJune = ee.ImageCollection(sentinelCollection
  .filterBounds(tRegion)
  .filterDate('2019-06-01', '2019-07-01')
  .select(['B8','B11','B12']))
  .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 20));

var JuneMean = sentinelJune.reduce(ee.Reducer.mean());

// JULY
var sentinelJuly = ee.ImageCollection(sentinelCollection
  .filterBounds(tRegion)
  .filterDate('2019-07-01', '2019-08-01')
  .select(['B8','B11','B12']))
  .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 20));

var JulyMean = sentinelJuly.reduce(ee.Reducer.mean());

// AUGUST
var sentinelAugust = ee.ImageCollection(sentinelCollection
  .filterBounds(tRegion)
  .filterDate('2019-08-01', '2019-09-01')
  .select(['B8','B11','B12']))
  .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 20));

var AugustMean = sentinelAugust.reduce(ee.Reducer.mean());
}

// GET STD IMAGES
{
/*var FebStd = FebMean.reduceNeighborhood({
  reducer: ee.Reducer.stdDev(),
  kernel: ee.Kernel.circle(5),
});
var MarchStd = MarchMean.reduceNeighborhood({
  reducer: ee.Reducer.stdDev(),
  kernel: ee.Kernel.circle(5),
});
var AprilStd = AprilMean.reduceNeighborhood({
  reducer: ee.Reducer.stdDev(),
  kernel: ee.Kernel.circle(5),
});*/
var MayStd = MayMean.reduceNeighborhood({
  reducer: ee.Reducer.stdDev(),
  kernel: ee.Kernel.circle(5),
});
var JuneStd = JuneMean.reduceNeighborhood({
  reducer: ee.Reducer.stdDev(),
  kernel: ee.Kernel.circle(5),
});
var JulyStd = JulyMean.reduceNeighborhood({
  reducer: ee.Reducer.stdDev(),
  kernel: ee.Kernel.circle(5),
});
var AugustStd = AugustMean.reduceNeighborhood({
  reducer: ee.Reducer.stdDev(),
  kernel: ee.Kernel.circle(5),
});
}

// GET STD MEAN IMAGE
{
var stdCollection = ee.ImageCollection([/*FebStd,
                                       MarchStd,
                                       AprilStd,*/
                                       MayStd,
                                       JuneStd,
                                       JulyStd,
                                       AugustStd]);

var STDMean = ee.Image(stdCollection.reduce(ee.Reducer.mean())).clip(tRegion);

var STDMean = STDMean.reduce(ee.Reducer.mean());
}

// MATRIX OPERATIONS
{
// Create a list of weights for a 13x13 kernel.
var line1a1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line2a1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0,-1, 0, 0, 0];
var line3a1 =  [0, 0, 0, 0, 0, 0, 0, 0,-1, 0, 1, 0, 0];
var line4a1 =  [0, 0, 0, 0, 0, 0, 0,-1, 0, 1, 0, 0, 0];
var line5a1 =  [0, 0, 0, 0, 0, 0,-1, 0, 1, 0, 0, 0, 0];
var line6a1 =  [0, 0, 0, 0, 0,-1, 0, 1, 0, 0, 0, 0, 0];
var centera1 = [0, 0, 0, 0,-1, 0, 1, 0, 0, 0, 0, 0, 0];
var line8a1 =  [0, 0, 0,-1, 0, 1, 0, 0, 0, 0, 0, 0, 0];
var line9a1 =  [0, 0,-1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
var line10a1 = [0,-1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line11a1 = [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line12a1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line13a1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var matrix_a1 = [line1a1,line2a1,line3a1,
                line4a1,line5a1,line6a1,
                       centera1,
                line8a1,line9a1,line10a1,
                line11a1,line12a1,line13a1];
                
// Create a list of weights for a 13x13 kernel.
var line1a2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line2a2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line3a2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0];
var line4a2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,-1, 0];
var line5a2 =  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0,-1, 0, 0];
var line6a2 =  [0, 0, 0, 0, 0, 0, 0, 1, 0,-1, 0, 0, 0];
var centera2 = [0, 0, 0, 0, 0, 0, 1, 0,-1, 0, 0, 0, 0];
var line8a2 =  [0, 0, 0, 0, 0, 1, 0,-1, 0, 0, 0, 0, 0];
var line9a2 =  [0, 0, 0, 0, 1, 0,-1, 0, 0, 0, 0, 0, 0];
var line10a2 = [0, 0, 0, 1, 0,-1, 0, 0, 0, 0, 0, 0, 0];
var line11a2 = [0, 0, 1, 0,-1, 0, 0, 0, 0, 0, 0, 0, 0];
var line12a2 = [0, 0, 0,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line13a2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var matrix_a2 = [line1a2, line2a2, line3a2,
                line4a2, line5a2, line6a2,
                       centera2,
                line8a2, line9a2, line10a2,
                line11a2,line12a2,line13a2];

// Create the kernel from the weights.
var kernela1 = ee.Kernel.fixed(13, 13, matrix_a1);
var kernela2 = ee.Kernel.fixed(13, 13, matrix_a2);

var convolvedA1 = STDMean.convolve(kernela1);
var convolvedA2 = STDMean.convolve(kernela2);
var conditionA1 = convolvedA1.gt(0);
var conditionA2 = convolvedA2.gt(0);
var conditionA12 = convolvedA1.updateMask(conditionA1)
                              .add(convolvedA2
                                   .updateMask(conditionA2))
                                               .gt(T);
var conditionA12 = conditionA12.updateMask(conditionA12);

var objectId = conditionA12.connectedComponents({
  connectedness: ee.Kernel.plus(1),
  maxSize: 256
});
//Map.addLayer(objectId.randomVisualizer(), null, 'Objects');
var objectSize = objectId.select('labels')
  .connectedPixelCount({
    maxSize: 256, eightConnected: ec
  });
var pixelArea = ee.Image.pixelArea();
var objectArea = objectSize.multiply(pixelArea);
var areaMask = objectArea.gte(CT);
var conditionA12 = ee.Algorithms.If(ConnectedComponents,
                                    conditionA12.updateMask(areaMask),
                                    conditionA12);


// Create a list of weights for a 13x13 kernel.
var line1b1 =  [0, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0];
var line2b1 =  [0, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0];
var line3b1 =  [0, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0];
var line4b1 =  [0, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0];
var line5b1 =  [0, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0];
var line6b1 =  [0, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0];
var centerb1 = [0, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0];
var line8b1 =  [0, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0];
var line9b1 =  [0, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0];
var line10b1 = [0, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0];
var line11b1 = [0, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0];
var line12b1 = [0, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0];
var line13b1 = [0, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0];

var matrix_b1 = [line1b1, line2b1, line3b1,
                line4b1, line5b1, line6b1,
                       centerb1,
                line8b1, line9b1, line10b1,
                line11b1,line12b1,line13b1];

// Create a list of weights for a 13x13 kernel.
var line1b2 =  [0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0];
var line2b2 =  [0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0];
var line3b2 =  [0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0];
var line4b2 =  [0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0];
var line5b2 =  [0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0];
var line6b2 =  [0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0];
var centerb2 = [0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0];
var line8b2 =  [0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0];
var line9b2 =  [0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0];
var line10b2 = [0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0];
var line11b2 = [0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0];
var line12b2 = [0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0];
var line13b2 = [0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0];

var matrix_b2 = [line1b2, line2b2, line3b2,
                line4b2, line5b2, line6b2,
                       centerb2,
                line8b2, line9b2, line10b2,
                line11b2,line12b2,line13b2];
                
// Create the kernel from the weights.
var kernelb1 = ee.Kernel.fixed(13, 13, matrix_b1);
var kernelb2 = ee.Kernel.fixed(13, 13, matrix_b2);

var convolvedB1 = STDMean.convolve(kernelb1);
var convolvedB2 = STDMean.convolve(kernelb2);
var conditionB1 = convolvedB1.gt(0);
var conditionB2 = convolvedB2.gt(0);
var conditionB12 = convolvedB1.updateMask(conditionB1)
                              .add(convolvedB2
                                   .updateMask(conditionB2))
                                               .gt(T);
                                               
var conditionB12 = conditionB12.updateMask(conditionB12);
//Map.addLayer(conditionB12, {bands: ['B8_mean_stdDev_mean'], max: 0.5}, 'convolvedB');

var objectId = conditionB12.connectedComponents({
  connectedness: ee.Kernel.plus(1),
  maxSize: 256
});
//Map.addLayer(objectId.randomVisualizer(), null, 'Objects');
var objectSize = objectId.select('labels')
  .connectedPixelCount({
    maxSize: 256, eightConnected: ec
  });
var pixelArea = ee.Image.pixelArea();
var objectArea = objectSize.multiply(pixelArea);
var areaMask = objectArea.gte(CT);
var conditionB12 = ee.Algorithms.If(ConnectedComponents,
                                    conditionB12.updateMask(areaMask),
                                    conditionB12);


// Create a list of weights for a 13x13 kernel.
var line1c1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line2c1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line3c1 =  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line4c1 =  [0, -1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line5c1 =  [0, 0, -1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
var line6c1 =  [0, 0, 0, -1, 0, 1, 0, 0, 0, 0, 0, 0, 0];
var centerc1 = [0, 0, 0, 0, -1, 0, 1, 0, 0, 0, 0, 0, 0];
var line8c1 =  [0, 0, 0, 0, 0, -1, 0, 1, 0, 0, 0, 0, 0];
var line9c1 =  [0, 0, 0, 0, 0, 0, -1, 0, 1, 0, 0, 0, 0];
var line10c1 = [0, 0, 0, 0, 0, 0, 0, -1, 0, 1, 0, 0, 0];
var line11c1 = [0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 1, 0, 0];
var line12c1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0];
var line13c1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var matrix_c1 = [line1c1,line2c1,line3c1,
                 line4c1,line5c1,line6c1,
                         centerc1,
                 line8c1,line9c1,line10c1,
                 line11c1,line12c1,line13c1];

// Create a list of weights for a 13x13 kernel.
var line1c2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line2c2 =  [0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line3c2 =  [0, 0, 1, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0];
var line4c2 =  [0, 0, 0, 1, 0, -1, 0, 0, 0, 0, 0, 0, 0];
var line5c2 =  [0, 0, 0, 0, 1, 0, -1, 0, 0, 0, 0, 0, 0];
var line6c2 =  [0, 0, 0, 0, 0, 1, 0, -1, 0, 0, 0, 0, 0];
var centerc2 = [0, 0, 0, 0, 0, 0, 1, 0, -1, 0, 0, 0, 0];
var line8c2 =  [0, 0, 0, 0, 0, 0, 0, 1, 0, -1, 0, 0, 0];
var line9c2 =  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, -1, 0, 0];
var line10c2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, -1, 0];
var line11c2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0];
var line12c2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line13c2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var matrix_c2 = [line1c2,line2c2,line3c2,
                 line4c2,line5c2,line6c2,
                         centerc2,
                 line8c2,line9c2,line10c2,
                 line11c2,line12c2,line13c2];
                
// Create the kernel from the weights.
var kernelc1 = ee.Kernel.fixed(13, 13, matrix_c1);
var kernelc2 = ee.Kernel.fixed(13, 13, matrix_c2);

var convolvedC1 = STDMean.convolve(kernelc1);
var convolvedC2 = STDMean.convolve(kernelc2);
var conditionC1 = convolvedC1.gt(0)
var conditionC2 = convolvedC2.gt(0)
var conditionC12 = convolvedC1.updateMask(conditionC1)
                              .add(convolvedC2
                                   .updateMask(conditionC2))
                                               .gt(T)
                                               
var conditionC12 = conditionC12.updateMask(conditionC12)
//Map.addLayer(conditionC12, {bands: ['B8_mean_stdDev_mean'], max: 0.5}, 'convolvedC');

var objectId = conditionC12.connectedComponents({
  connectedness: ee.Kernel.plus(1),
  maxSize: 256
});
//Map.addLayer(objectId.randomVisualizer(), null, 'Objects');
var objectSize = objectId.select('labels')
  .connectedPixelCount({
    maxSize: 256, eightConnected: ec
  });
var pixelArea = ee.Image.pixelArea();
var objectArea = objectSize.multiply(pixelArea);
var areaMask = objectArea.gte(CT);
var conditionC12 = ee.Algorithms.If(ConnectedComponents,
                                    conditionC12.updateMask(areaMask),
                                    conditionC12);

// Create a list of weights for a 13x13 kernel.
var line1d1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line2d1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line3d1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line4d1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line5d1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line6d1 =  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
var centerd1 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var line8d1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line9d1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line10d1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line11d1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line12d1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line13d1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var matrix_d1 = [line1d1,line2d1, line3d1,
                line4d1,line5d1, line6d1,
                       centerd1,
                line8d1, line9d1, line10d1,
                line11d1,line12d1,line13d1];

// Create a list of weights for a 13x13 kernel.
var line1d2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line2d2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line3d2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line4d2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line5d2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line6d2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var centerd2 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var line8d2 =  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
var line9d2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line10d2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line11d2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line12d2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line13d2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var matrix_d2 = [line1d2, line2d2, line3d2,
                line4d2, line5d2, line6d2,
                       centerd2,
                line8d2, line9d2, line10d2,
                line11d2,line12d2,line13d2];
                
// Create the kernel from the weights.
var kerneld1 = ee.Kernel.fixed(13, 13, matrix_d1);
var kerneld2 = ee.Kernel.fixed(13, 13, matrix_d2);

var convolvedD1 = STDMean.convolve(kerneld1);
var convolvedD2 = STDMean.convolve(kerneld2);
var conditionD1 = convolvedD1.gt(0)
var conditionD2 = convolvedD2.gt(0)
var conditionD12 = convolvedD1.updateMask(conditionD1)
                              .add(convolvedD2
                                   .updateMask(conditionD2))
                                               .gt(T)
                                               
var conditionD12 = conditionD12.updateMask(conditionD12)
//Map.addLayer(conditionD12, {bands: ['B8_mean_stdDev_mean'], max: 0.5}, 'convolvedD');

var objectId = conditionD12.connectedComponents({
  connectedness: ee.Kernel.plus(1),
  maxSize: 256
});
//Map.addLayer(objectId.randomVisualizer(), null, 'Objects');
var objectSize = objectId.select('labels')
  .connectedPixelCount({
    maxSize: 256, eightConnected: ec
  });
var pixelArea = ee.Image.pixelArea();
var objectArea = objectSize.multiply(pixelArea);
var areaMask = objectArea.gte(CT);
var conditionD12 = ee.Algorithms.If(ConnectedComponents,
                                    conditionD12.updateMask(areaMask),
                                    conditionD12);

// Create a list of weights for a 13x13 kernel.
var line1e1 =  [0, 0, 0, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0];
var line2e1 =  [0, 0, 0, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0];
var line3e1 =  [0, 0, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0, 0];
var line4e1 =  [0, 0, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0, 0];
var line5e1 =  [0, 0, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0, 0];
var line6e1 =  [0, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0];
var centere1 = [0, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0];
var line8e1 =  [0, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0];
var line9e1 =  [0, 0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0, 0];
var line10e1 = [0, 0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0, 0];
var line11e1 = [0, 0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0, 0];
var line12e1 = [0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
var line13e1 = [0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0, 0, 0];

var matrix_e1 = [line1e1,line2e1, line3e1,
                line4e1,line5e1, line6e1,
                       centere1,
                line8e1, line9e1, line10e1,
                line11e1,line12e1,line13e1];

// Create a list of weights for a 13x13 kernel.
var line1e2 =  [0, 0, 0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0];
var line2e2 =  [0, 0, 0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0];
var line3e2 =  [0, 0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0];
var line4e2 =  [0, 0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0];
var line5e2 =  [0, 0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0];
var line6e2 =  [0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0];
var centere2 = [0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0];
var line8e2 =  [0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0];
var line9e2 =  [0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0];
var line10e2 = [0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0];
var line11e2 = [0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0];
var line12e2 = [0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0, 0];
var line13e2 = [0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0, 0];

var matrix_e2 = [line1e2, line2e2, line3e2,
                line4e2, line5e2, line6e2,
                       centere2,
                line8e2, line9e2, line10e2,
                line11e2,line12e2,line13e2];
                
// Create the kernel from the weights.
var kernele1 = ee.Kernel.fixed(13, 13, matrix_e1);
var kernele2 = ee.Kernel.fixed(13, 13, matrix_e2);

var convolvedE1 = STDMean.convolve(kernele1);
var convolvedE2 = STDMean.convolve(kernele2);
var conditionE1 = convolvedE1.gt(0)
var conditionE2 = convolvedE2.gt(0)
var conditionE12 = convolvedE1.updateMask(conditionE1)
                              .add(convolvedE2
                                   .updateMask(conditionE2))
                                               .gt(T)
                                               
var conditionE12 = conditionE12.updateMask(conditionE12)
//Map.addLayer(conditionE12, {bands: ['B8_mean_stdDev_mean'], max: 0.5}, 'convolvedE');

var objectId = conditionE12.connectedComponents({
  connectedness: ee.Kernel.plus(1),
  maxSize: 256
});
//Map.addLayer(objectId.randomVisualizer(), null, 'Objects');
var objectSize = objectId.select('labels')
  .connectedPixelCount({
    maxSize: 256, eightConnected: ec
  });
var pixelArea = ee.Image.pixelArea();
var objectArea = objectSize.multiply(pixelArea);
var areaMask = objectArea.gte(CT);
var conditionE12 = ee.Algorithms.If(ConnectedComponents,
                                    conditionE12.updateMask(areaMask),
                                    conditionE12);

// Create a list of weights for a 13x13 kernel.
//              1  2  3  4  5  6  7  8  9 10 11 12 13
var line1f1 =  [0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0, 0, 0];
var line2f1 =  [0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0, 0, 0];
var line3f1 =  [0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0, 0];
var line4f1 =  [0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0, 0];
var line5f1 =  [0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0, 0];
var line6f1 =  [0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0];
var centerf1 = [0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0];
var line8f1 =  [0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0];
var line9f1 =  [0, 0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0];
var line10f1 = [0, 0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0];
var line11f1 = [0, 0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0];
var line12f1 = [0, 0, 0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0];
var line13f1 = [0, 0, 0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0];

var matrix_f1 = [line1f1, line2f1, line3f1,
                line4f1, line5f1, line6f1,
                       centerf1,
                line8f1, line9f1, line10f1,
                line11f1,line12f1,line13f1];

// Create a list of weights for a 13x13 kernel.
//              1  2  3  4  5  6  7  8  9 10 11 12 13
var line1f2 =  [0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
var line2f2 =  [0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
var line3f2 =  [0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0, 0];
var line4f2 =  [0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0, 0];
var line5f2 =  [0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0, 0];
var line6f2 =  [0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0];
var centerf2 = [0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0];
var line8f2 =  [0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0];
var line9f2 =  [0, 0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0];
var line10f2 = [0, 0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0];
var line11f2 = [0, 0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0];
var line12f2 = [0, 0, 0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0];
var line13f2 = [0, 0, 0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0];

var matrix_f2 = [line1f2, line2f2, line3f2,
                line4f2, line5f2, line6f2,
                       centerf2,
                line8f2, line9f2, line10f2,
                line11f2,line12f2,line13f2];
                
// Create the kernel from the weights.
var kernelf1 = ee.Kernel.fixed(13, 13, matrix_f1);
var kernelf2 = ee.Kernel.fixed(13, 13, matrix_f2);

var convolvedF1 = STDMean.convolve(kernelf1);
var convolvedF2 = STDMean.convolve(kernelf2);
var conditionF1 = convolvedF1.gt(0)
var conditionF2 = convolvedF2.gt(0)
var conditionF12 = convolvedF1.updateMask(conditionF1)
                              .add(convolvedF2
                                   .updateMask(conditionF2))
                                               .gt(T)
                                               
var conditionF12 = conditionF12.updateMask(conditionF12)
//Map.addLayer(conditionF12, {bands: ['B8_mean_stdDev_mean'], max: 0.5}, 'convolvedF');

var objectId = conditionF12.connectedComponents({
  connectedness: ee.Kernel.plus(1),
  maxSize: 256
});
//Map.addLayer(objectId.randomVisualizer(), null, 'Objects');
var objectSize = objectId.select('labels')
  .connectedPixelCount({
    maxSize: 256, eightConnected: ec
  });
var pixelArea = ee.Image.pixelArea();
var objectArea = objectSize.multiply(pixelArea);
var areaMask = objectArea.gte(CT);
var conditionF12 = ee.Algorithms.If(ConnectedComponents,
                                    conditionF12.updateMask(areaMask),
                                    conditionF12);

// Create a list of weights for a 13x13 kernel.
//              1  2  3  4  5  6  7  8  9 10 11 12 13
var line1g1 =  [0, 0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0];
var line2g1 =  [0, 0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0];
var line3g1 =  [0, 0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0];
var line4g1 =  [0, 0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0];
var line5g1 =  [0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0];
var line6g1 =  [0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0];
var centerg1 = [0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0];
var line8g1 =  [0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0];
var line9g1 =  [0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0];
var line10g1 = [0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0, 0];
var line11g1 = [0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0, 0];
var line12g1 = [0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0, 0];
var line13g1 = [0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0, 0];

var matrix_g1 = [line1g1,line2g1,line3g1,
                 line4g1,line5g1,line6g1,
                         centerg1,
                 line8g1,line9g1,line10g1,
                 line11g1,line12g1,line13g1];

// Create a list of weights for a 13x13 kernel.
//              1  2  3  4  5  6  7  8  9 10 11 12 13
var line1g2 =  [0, 0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0];
var line2g2 =  [0, 0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0];
var line3g2 =  [0, 0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0];
var line4g2 =  [0, 0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0];
var line5g2 =  [0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0];
var line6g2 =  [0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0];
var centerg2 = [0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0];
var line8g2 =  [0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0];
var line9g2 =  [0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0];
var line10g2 = [0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0, 0];
var line11g2 = [0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0, 0];
var line12g2 = [0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0, 0];
var line13g2 = [0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0, 0];

var matrix_g2 = [line1g2,line2g2,line3g2,
                 line4g2,line5g2,line6g2,
                         centerg2,
                 line8g2,line9g2,line10g2,
                 line11g2,line12g2,line13g2];
                
// Create the kernel from the weights.
var kernelg1 = ee.Kernel.fixed(13, 13, matrix_g1);
var kernelg2 = ee.Kernel.fixed(13, 13, matrix_g2);

var convolvedG1 = STDMean.convolve(kernelg1);
var convolvedG2 = STDMean.convolve(kernelg2);
var conditionG1 = convolvedG1.gt(0)
var conditionG2 = convolvedG2.gt(0)
var conditionG12 = convolvedG1.updateMask(conditionG1)
                              .add(convolvedG2
                                   .updateMask(conditionG2))
                                               .gt(T)
                                               
var conditionG12 = conditionG12.updateMask(conditionG12)

var objectId = conditionG12.connectedComponents({
  connectedness: ee.Kernel.plus(1),
  maxSize: 256
});
//Map.addLayer(objectId.randomVisualizer(), null, 'Objects');
var objectSize = objectId.select('labels')
  .connectedPixelCount({
    maxSize: 256, eightConnected: ec
  });
var pixelArea = ee.Image.pixelArea();
var objectArea = objectSize.multiply(pixelArea);
var areaMask = objectArea.gte(CT);
var conditionG12 = ee.Algorithms.If(ConnectedComponents,
                                    conditionG12.updateMask(areaMask),
                                    conditionG12);

// Create a list of weights for a 13x13 kernel.
//              1  2  3  4  5  6  7  8  9 10 11 12 13
var line1h1 =  [0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0, 0];
var line2h1 =  [0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0, 0];
var line3h1 =  [0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0, 0];
var line4h1 =  [0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0, 0];
var line5h1 =  [0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0];
var line6h1 =  [0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0];
var centerh1 = [0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0];
var line8h1 =  [0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0];
var line9h1 =  [0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0];
var line10h1 = [0, 0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0];
var line11h1 = [0, 0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0];
var line12h1 = [0, 0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0];
var line13h1 = [0, 0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0];

var matrix_h1 = [line1h1,line2h1,line3h1,
                 line4h1,line5h1,line6h1,
                         centerh1,
                 line8h1,line9h1,line10h1,
                 line11h1,line12h1,line13h1];

// Create a list of weights for a 13x13 kernel.
//              1  2  3  4  5  6  7  8  9 10 11 12 13
var line1h2 =  [0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0, 0];
var line2h2 =  [0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0, 0];
var line3h2 =  [0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0, 0];
var line4h2 =  [0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0, 0];
var line5h2 =  [0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0];
var line6h2 =  [0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0];
var centerh2 = [0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0];
var line8h2 =  [0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0];
var line9h2 =  [0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0];
var line10h2 = [0, 0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0];
var line11h2 = [0, 0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0];
var line12h2 = [0, 0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0];
var line13h2 = [0, 0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0];

var matrix_h2 = [line1h2,line2h2,line3h2,
                 line4h2,line5h2,line6h2,
                         centerh2,
                 line8h2,line9h2,line10h2,
                 line11h2,line12h2,line13h2];
                
// Create the kernel from the weights.
var kernelh1 = ee.Kernel.fixed(13, 13, matrix_h1);
var kernelh2 = ee.Kernel.fixed(13, 13, matrix_h2);

var convolvedH1 = STDMean.convolve(kernelh1);
var convolvedH2 = STDMean.convolve(kernelh2);
var conditionH1 = convolvedH1.gt(0)
var conditionH2 = convolvedH2.gt(0)
var conditionH12 = convolvedH1.updateMask(conditionH1)
                              .add(convolvedH2
                                   .updateMask(conditionH2))
                                               .gt(T)
                                               
var conditionH12 = conditionH12.updateMask(conditionH12)
//Map.addLayer(conditionH12, {bands: ['B8_mean_stdDev_mean'], max: 0.5}, 'convolvedH');

var objectId = conditionH12.connectedComponents({
  connectedness: ee.Kernel.plus(1),
  maxSize: 256
});
//Map.addLayer(objectId.randomVisualizer(), null, 'Objects');
var objectSize = objectId.select('labels')
  .connectedPixelCount({
    maxSize: 256, eightConnected: ec
  });
var pixelArea = ee.Image.pixelArea();
var objectArea = objectSize.multiply(pixelArea);
var areaMask = objectArea.gte(CT);
var conditionH12 = ee.Algorithms.If(ConnectedComponents,
                                    conditionH12.updateMask(areaMask),
                                    conditionH12);
                                    
// Create a list of weights for a 13x13 kernel.
//              1  2  3  4  5  6  7  8  9 10 11 12 13
var line1i1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line2i1 =  [0, 0, 0, 0, 0, 0, 0, 0,-1, 1, 0, 0, 0];
var line3i1 =  [0, 0, 0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0];
var line4i1 =  [0, 0, 0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0];
var line5i1 =  [0, 0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0];
var line6i1 =  [0, 0, 0, 0, 0,-1, 0, 1, 0, 0, 0, 0, 0];
var centeri1 = [0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0];
var line8i1 =  [0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0, 0];
var line9i1 =  [0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0, 0];
var line10i1 = [0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
var line11i1 = [0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
var line12i1 = [0, 0,-1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line13i1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var matrix_i1 = [line1i1,line2i1,line3i1,
                 line4i1,line5i1,line6i1,
                         centeri1,
                 line8i1,line9i1,line10i1,
                 line11i1,line12i1,line13i1];

// Create a list of weights for a 13x13 kernel.
//              1  2  3  4  5  6  7  8  9 10 11 12 13
var line1i2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line2i2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1,-1, 0, 0];
var line3i2 =  [0, 0, 0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0];
var line4i2 =  [0, 0, 0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0];
var line5i2 =  [0, 0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0];
var line6i2 =  [0, 0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0];
var centeri2 = [0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0];
var line8i2 =  [0, 0, 0, 0, 0, 1, 0,-1, 0, 0, 0, 0, 0];
var line9i2 =  [0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0, 0];
var line10i2 = [0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0, 0, 0];
var line11i2 = [0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0, 0, 0];
var line12i2 = [0, 0, 0, 1,-1, 0, 0, 0, 0, 0, 0, 0, 0];
var line13i2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var matrix_i2 = [line1i2,line2i2,line3i2,
                 line4i2,line5i2,line6i2,
                         centeri2,
                 line8i2,line9i2,line10i2,
                 line11i2,line12i2,line13i2];
                
// Create the kernel from the weights.
var kerneli1 = ee.Kernel.fixed(13, 13, matrix_i1);
var kerneli2 = ee.Kernel.fixed(13, 13, matrix_i2);

var convolvedI1 = STDMean.convolve(kerneli1);
var convolvedI2 = STDMean.convolve(kerneli2);
var conditionI1 = convolvedI1.gt(0)
var conditionI2 = convolvedI2.gt(0)
var conditionI12 = convolvedI1.updateMask(conditionI1)
                              .add(convolvedI2
                                   .updateMask(conditionI2))
                                               .gt(T)
                                               
var conditionI12 = conditionI12.updateMask(conditionI12)
//Map.addLayer(conditionI12, {bands: ['B8_mean_stdDev_mean'], max: 0.5}, 'convolvedI');

var objectId = conditionI12.connectedComponents({
  connectedness: ee.Kernel.plus(1),
  maxSize: 256
});
//Map.addLayer(objectId.randomVisualizer(), null, 'Objects');
var objectSize = objectId.select('labels')
  .connectedPixelCount({
    maxSize: 256, eightConnected: ec
  });
var pixelArea = ee.Image.pixelArea();
var objectArea = objectSize.multiply(pixelArea);
var areaMask = objectArea.gte(CT);
var conditionI12 = ee.Algorithms.If(ConnectedComponents,
                                    conditionI12.updateMask(areaMask),
                                    conditionI12);

// Create a list of weights for a 13x13 kernel.
//              1  2  3  4  5  6  7  8  9 10 11 12 13
var line1j1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line2j1 =  [0, 0, 0, 0, 0, 0, 0, 0,-1, 1, 0, 0, 0];
var line3j1 =  [0, 0, 0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0];
var line4j1 =  [0, 0, 0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0];
var line5j1 =  [0, 0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0];
var line6j1 =  [0, 0, 0, 0, 0,-1, 0, 1, 0, 0, 0, 0, 0];
var centerj1 = [0, 0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0];
var line8j1 =  [0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0, 0];
var line9j1 =  [0, 0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0, 0];
var line10j1 = [0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
var line11j1 = [0, 0, 0,-1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
var line12j1 = [0, 0,-1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line13j1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var matrix_j1 = [line1j1,line2j1,line3j1,
                 line4j1,line5j1,line6j1,
                         centerj1,
                 line8j1,line9j1,line10j1,
                 line11j1,line12j1,line13j1];

// Create a list of weights for a 13x13 kernel.
//              1  2  3  4  5  6  7  8  9 10 11 12 13
var line1j2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line2j2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1,-1, 0, 0];
var line3j2 =  [0, 0, 0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0];
var line4j2 =  [0, 0, 0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0];
var line5j2 =  [0, 0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0];
var line6j2 =  [0, 0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0];
var centerj2 = [0, 0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0];
var line8j2 =  [0, 0, 0, 0, 0, 1, 0,-1, 0, 0, 0, 0, 0];
var line9j2 =  [0, 0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0, 0];
var line10j2 = [0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0, 0, 0];
var line11j2 = [0, 0, 0, 0, 1,-1, 0, 0, 0, 0, 0, 0, 0];
var line12j2 = [0, 0, 0, 1,-1, 0, 0, 0, 0, 0, 0, 0, 0];
var line13j2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var matrix_j2 = [line1j2,line2j2,line3j2,
                 line4j2,line5j2,line6j2,
                         centerj2,
                 line8j2,line9j2,line10j2,
                 line11j2,line12j2,line13j2];
                
// Create the kernel from the weights.
var kernelj1 = ee.Kernel.fixed(13, 13, matrix_j1);
var kernelj2 = ee.Kernel.fixed(13, 13, matrix_j2);

var convolvedJ1 = STDMean.convolve(kernelj1);
var convolvedJ2 = STDMean.convolve(kernelj2);
var conditionJ1 = convolvedJ1.gt(0)
var conditionJ2 = convolvedJ2.gt(0)
var conditionJ12 = convolvedJ1.updateMask(conditionJ1)
                              .add(convolvedJ2
                                   .updateMask(conditionJ2))
                                               .gt(T)
                                               
var conditionJ12 = conditionJ12.updateMask(conditionJ12)

var objectId = conditionJ12.connectedComponents({
  connectedness: ee.Kernel.plus(1),
  maxSize: 256
});
//Map.addLayer(objectId.randomVisualizer(), null, 'Objects');
var objectSize = objectId.select('labels')
  .connectedPixelCount({
    maxSize: 256, eightConnected: ec
  });
var pixelArea = ee.Image.pixelArea();
var objectArea = objectSize.multiply(pixelArea);
var areaMask = objectArea.gte(CT);
var conditionJ12 = ee.Algorithms.If(ConnectedComponents,
                                    conditionJ12.updateMask(areaMask),
                                    conditionJ12);

// Create a list of weights for a 13x13 kernel.
//              1  2  3  4  5  6  7  8  9 10 11 12 13
var line1k1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line2k1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line3k1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1, 0];
var line4k1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1, 1, 0];
var line5k1 =  [0, 0, 0, 0, 0, 0, 0,-1,-1, 1, 1, 0, 0];
var line6k1 =  [0, 0, 0, 0, 0,-1,-1, 1, 1, 0, 0, 0, 0];
var centerk1 = [0, 0, 0, 0,-1, 0, 1, 0, 0, 0, 0, 0, 0];
var line8k1 =  [0, 0,-1,-1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
var line9k1 =  [0,-1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line10k1 = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line11k1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line12k1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line13k1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var matrix_k1 = [line1k1,line2k1,line3k1,
                 line4k1,line5k1,line6k1,
                         centerk1,
                 line8k1,line9k1,line10k1,
                 line11k1,line12k1,line13k1];

// Create a list of weights for a 13x13 kernel.
//              1  2  3  4  5  6  7  8  9 10 11 12 13
var line1k2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line2k2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line3k2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line4k2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0];
var line5k2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,-1, 0];
var line6k2 =  [0, 0, 0, 0, 0, 0, 0, 1, 1,-1,-1, 0, 0];
var centerk2 = [0, 0, 0, 0, 0, 0, 1, 0,-1, 0, 0, 0, 0];
var line8k2 =  [0, 0, 0, 0, 1, 1,-1,-1, 0, 0, 0, 0, 0];
var line9k2 =  [0, 0, 1, 1,-1,-1, 0, 0, 0, 0, 0, 0, 0];
var line10k2 = [0, 1,-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line11k2 = [0,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line12k2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line13k2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var matrix_k2 = [line1k2,line2k2,line3k2,
                 line4k2,line5k2,line6k2,
                         centerk2,
                 line8k2,line9k2,line10k2,
                 line11k2,line12k2,line13k2];
                
// Create the kernel from the weights.
var kernelk1 = ee.Kernel.fixed(13, 13, matrix_k1);
var kernelk2 = ee.Kernel.fixed(13, 13, matrix_k2);

var convolvedK1 = STDMean.convolve(kernelk1);
var convolvedK2 = STDMean.convolve(kernelk2);
var conditionK1 = convolvedK1.gt(0)
var conditionK2 = convolvedK2.gt(0)
var conditionK12 = convolvedK1.updateMask(conditionK1)
                              .add(convolvedK2
                                   .updateMask(conditionK2))
                                               .gt(T)
                                               
var conditionK12 = conditionK12.updateMask(conditionK12)

var objectId = conditionK12.connectedComponents({
  connectedness: ee.Kernel.plus(1),
  maxSize: 256
});
//Map.addLayer(objectId.randomVisualizer(), null, 'Objects');
var objectSize = objectId.select('labels')
  .connectedPixelCount({
    maxSize: 256, eightConnected: ec
  });
var pixelArea = ee.Image.pixelArea();
var objectArea = objectSize.multiply(pixelArea);
var areaMask = objectArea.gte(CT);
var conditionK12 = ee.Algorithms.If(ConnectedComponents,
                                    conditionK12.updateMask(areaMask),
                                    conditionK12);

// Create a list of weights for a 13x13 kernel.
//              1  2  3  4  5  6  7  8  9 10 11 12 13
var line1l1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line2l1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line3l1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line4l1 =  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line5l1 =  [0,-1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line6l1 =  [0, 0,-1,-1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
var centerl1 = [0, 0, 0, 0,-1, 0, 1, 0, 0, 0, 0, 0, 0];
var line8l1 =  [0, 0, 0, 0, 0,-1,-1, 1, 1, 0, 0, 0, 0];
var line9l1 =  [0, 0, 0, 0, 0, 0, 0,-1,-1, 1, 1, 0, 0];
var line10l1 = [0, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1, 1, 0];
var line11l1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1, 0];
var line12l1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line13l1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var matrix_l1 = [line1l1,line2l1,line3l1,
                 line4l1,line5l1,line6l1,
                         centerl1,
                 line8l1,line9l1,line10l1,
                 line11l1,line12l1,line13l1];

// Create a list of weights for a 13x13 kernel.
//              1  2  3  4  5  6  7  8  9 10 11 12 13
var line1l2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line2l2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line3l2 =  [0,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line4l2 =  [0, 1,-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line5l2 =  [0, 0, 1, 1,-1,-1, 0, 0, 0, 0, 0, 0, 0];
var line6l2 =  [0, 0, 0, 0, 1, 1,-1,-1, 0, 0, 0, 0, 0];
var centerl2 = [0, 0, 0, 0, 0, 0, 1, 0,-1, 0, 0, 0, 0];
var line8l2 =  [0, 0, 0, 0, 0, 0, 0, 1, 1,-1,-1, 0, 0];
var line9l2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,-1, 0];
var line10l2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0];
var line11l2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line12l2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line13l2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var matrix_l2 = [line1l2,line2l2,line3l2,
                 line4l2,line5l2,line6l2,
                         centerl2,
                 line8l2,line9l2,line10l2,
                 line11l2,line12l2,line13l2];
                
// Create the kernel from the weights.
var kernell1 = ee.Kernel.fixed(13, 13, matrix_l1);
var kernell2 = ee.Kernel.fixed(13, 13, matrix_l2);

var convolvedL1 = STDMean.convolve(kernell1);
var convolvedL2 = STDMean.convolve(kernell2);
var conditionL1 = convolvedL1.gt(0)
var conditionL2 = convolvedL2.gt(0)
var conditionL12 = convolvedL1.updateMask(conditionL1)
                              .add(convolvedL2
                                   .updateMask(conditionL2))
                                               .gt(T)
                          
var conditionL12 = conditionL12.updateMask(conditionL12)
//Map.addLayer(conditionL12, {bands: ['B8_mean_stdDev_mean'], max: 0.5}, 'convolvedL');

var objectId = conditionL12.connectedComponents({
  connectedness: ee.Kernel.plus(1),
  maxSize: 256
});
//Map.addLayer(objectId.randomVisualizer(), null, 'Objects');
var objectSize = objectId.select('labels')
  .connectedPixelCount({
    maxSize: 256, eightConnected: ec
  });
var pixelArea = ee.Image.pixelArea();
var objectArea = objectSize.multiply(pixelArea);
var areaMask = objectArea.gte(CT);
var conditionL12 = ee.Algorithms.If(ConnectedComponents,
                                    conditionL12.updateMask(areaMask),
                                    conditionL12);

// Create a list of weights for a 13x13 kernel.
//              1  2  3  4  5  6  7  8  9 10 11 12 13
var line1m1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line2m1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line3m1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line4m1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1];
var line5m1 =  [0, 0, 0, 0, 0, 0, 0, 0,-1,-1,-1, 1, 1];
var line6m1 =  [0, 0, 0, 0, 0,-1,-1,-1, 1, 1, 1, 0, 0];
var centerm1 = [0, 0,-1,-1,-1, 1, 1, 1, 0, 0, 0, 0, 0];
var line8m1 = [-1,-1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
var line9m1 =  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line10m1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line11m1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line12m1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line13m1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var matrix_m1 = [line1m1,line2m1,line3m1,
                 line4m1,line5m1,line6m1,
                         centerm1,
                 line8m1,line9m1,line10m1,
                 line11m1,line12m1,line13m1];

// Create a list of weights for a 13x13 kernel.
//              1  2  3  4  5  6  7  8  9 10 11 12 13
var line1m2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line2m2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line3m2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line4m2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line5m2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1];
var line6m2 =  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,-1,-1];
var centerm2 = [0, 0, 0, 0, 0, 1, 1, 1,-1,-1,-1, 0, 0];
var line8m2 =  [0, 0, 1, 1, 1,-1,-1,-1, 0, 0, 0, 0, 0];
var line9m2 =  [1, 1,-1,-1,-1, 0, 0, 0, 0, 0, 0, 0, 0];
var line10m2 =[-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line11m2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line12m2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line13m2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var matrix_m2 = [line1m2,line2m2,line3m2,
                 line4m2,line5m2,line6m2,
                         centerm2,
                 line8m2,line9m2,line10m2,
                 line11m2,line12m2,line13m2];
                
// Create the kernel from the weights.
var kernelm1 = ee.Kernel.fixed(13, 13, matrix_m1);
var kernelm2 = ee.Kernel.fixed(13, 13, matrix_m2);

var convolvedM1 = STDMean.convolve(kernelm1);
var convolvedM2 = STDMean.convolve(kernelm2);
var conditionM1 = convolvedM1.gt(0)
var conditionM2 = convolvedM2.gt(0)
var conditionM12 = convolvedM1.updateMask(conditionM1)
                              .add(convolvedM2
                                   .updateMask(conditionM2))
                                               .gt(T)
                                               
var conditionM12 = conditionM12.updateMask(conditionM12)

var objectId = conditionM12.connectedComponents({
  connectedness: ee.Kernel.plus(1),
  maxSize: 256
});
//Map.addLayer(objectId.randomVisualizer(), null, 'Objects');
var objectSize = objectId.select('labels')
  .connectedPixelCount({
    maxSize: 256, eightConnected: ec
  });
var pixelArea = ee.Image.pixelArea();
var objectArea = objectSize.multiply(pixelArea);
var areaMask = objectArea.gte(CT);
var conditionM12 = ee.Algorithms.If(ConnectedComponents,
                                    conditionM12.updateMask(areaMask),
                                    conditionM12);

// Create a list of weights for a 13x13 kernel.
//              1  2  3  4  5  6  7  8  9 10 11 12 13
var line1n1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line2n1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line3n1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line4n1 = [-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line5n1 =  [1, 1,-1,-1,-1, 0, 0, 0, 0, 0, 0, 0, 0];
var line6n1 =  [0, 0, 1, 1, 1,-1,-1,-1, 0, 0, 0, 0, 0];
var centern1 = [0, 0, 0, 0, 0, 1, 1, 1,-1,-1,-1, 0, 0];
var line8n1 =  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,-1,-1];
var line9n1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1];
var line10n1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line11n1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line12n1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line13n1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var matrix_n1 = [line1n1,line2n1,line3n1,
                 line4n1,line5n1,line6n1,
                         centern1,
                 line8n1,line9n1,line10n1,
                 line11n1,line12n1,line13n1];

// Create a list of weights for a 13x13 kernel.
//              1  2  3  4  5  6  7  8  9 10 11 12 13
var line1n2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line2n2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line3n2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line4n2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line5n2 =  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line6n2 = [-1,-1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
var centern2 = [0, 0,-1,-1,-1, 1, 1, 1, 0, 0, 0, 0, 0];
var line8n2 =  [0, 0, 0, 0, 0,-1,-1,-1, 1, 1, 1, 0, 0];
var line9n2 =  [0, 0, 0, 0, 0, 0, 0, 0,-1,-1,-1, 1, 1];
var line10n2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1];
var line11n2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line12n2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line13n2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var matrix_n2 = [line1n2,line2n2,line3n2,
                 line4n2,line5n2,line6n2,
                         centern2,
                 line8n2,line9n2,line10n2,
                 line11n2,line12n2,line13n2];
                
// Create the kernel from the weights.
var kerneln1 = ee.Kernel.fixed(13, 13, matrix_n1);
var kerneln2 = ee.Kernel.fixed(13, 13, matrix_n2);

var convolvedN1 = STDMean.convolve(kerneln1);
var convolvedN2 = STDMean.convolve(kerneln2);
var conditionN1 = convolvedN1.gt(0)
var conditionN2 = convolvedN2.gt(0)
var conditionN12 = convolvedN1.updateMask(conditionN1)
                              .add(convolvedN2
                                   .updateMask(conditionN2))
                                               .gt(T)
                                               
var conditionN12 = conditionN12.updateMask(conditionN12)

var objectId = conditionN12.connectedComponents({
  connectedness: ee.Kernel.plus(1),
  maxSize: 256
});
//Map.addLayer(objectId.randomVisualizer(), null, 'Objects');
var objectSize = objectId.select('labels')
  .connectedPixelCount({
    maxSize: 256, eightConnected: ec
  });
var pixelArea = ee.Image.pixelArea();
var objectArea = objectSize.multiply(pixelArea);
var areaMask = objectArea.gte(CT);
var conditionN12 = ee.Algorithms.If(ConnectedComponents,
                                    conditionN12.updateMask(areaMask),
                                    conditionN12);

// Create a list of weights for a 13x13 kernel.
//              1  2  3  4  5  6  7  8  9 10 11 12 13
var line1o1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line2o1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line3o1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line4o1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line5o1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1,-1,-1];
var line6o1 =  [0, 0, 0, 0,-1,-1,-1,-1,-1, 1, 1, 1, 1];
var centero1 =[-1,-1,-1,-1, 1, 1, 1, 1, 1, 0, 0, 0, 0];
var line8o1 =  [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line9o1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line10o1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line11o1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line12o1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line13o1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var matrix_o1 = [line1o1,line2o1,line3o1,
                 line4o1,line5o1,line6o1,
                         centero1,
                 line8o1,line9o1,line10o1,
                 line11o1,line12o1,line13o1];

// Create a list of weights for a 13x13 kernel.
//              1  2  3  4  5  6  7  8  9 10 11 12 13
var line1o2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line2o2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line3o2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line4o2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line5o2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line6o2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1];
var centero2 = [0, 0, 0, 0, 1, 1, 1, 1, 1,-1,-1,-1,-1];
var line8o2 =  [1, 1, 1, 1,-1,-1,-1,-1,-1, 0, 0, 0, 0];
var line9o2 = [-1,-1,-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line10o2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line11o2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line12o2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line13o2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var matrix_o2 = [line1o2,line2o2,line3o2,
                 line4o2,line5o2,line6o2,
                         centero2,
                 line8o2,line9o2,line10o2,
                 line11o2,line12o2,line13o2];
                
// Create the kernel from the weights.
var kernelo1 = ee.Kernel.fixed(13, 13, matrix_o1);
var kernelo2 = ee.Kernel.fixed(13, 13, matrix_o2);

var convolvedO1 = STDMean.convolve(kernelo1);
var convolvedO2 = STDMean.convolve(kernelo2);
var conditionO1 = convolvedO1.gt(0)
var conditionO2 = convolvedO2.gt(0)
var conditionO12 = convolvedO1.updateMask(conditionO1)
                              .add(convolvedO2
                                   .updateMask(conditionO2))
                                               .gt(T)
                                               
var conditionO12 = conditionO12.updateMask(conditionO12)

var objectId = conditionO12.connectedComponents({
  connectedness: ee.Kernel.plus(1),
  maxSize: 256
});
//Map.addLayer(objectId.randomVisualizer(), null, 'Objects');
var objectSize = objectId.select('labels')
  .connectedPixelCount({
    maxSize: 256, eightConnected: ec
  });
var pixelArea = ee.Image.pixelArea();
var objectArea = objectSize.multiply(pixelArea);
var areaMask = objectArea.gte(CT);
var conditionO12 = ee.Algorithms.If(ConnectedComponents,
                                    conditionO12.updateMask(areaMask),
                                    conditionO12);

// Create a list of weights for a 13x13 kernel.
//              1  2  3  4  5  6  7  8  9 10 11 12 13
var line1p1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line2p1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line3p1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line4p1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line5p1 = [-1,-1,-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line6p1 =  [1, 1, 1, 1,-1,-1,-1,-1,-1, 0, 0, 0, 0];
var centerp1 = [0, 0, 0, 0, 1, 1, 1, 1, 1,-1,-1,-1,-1];
var line8p1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1];
var line9p1 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line10p1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line11p1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line12p1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line13p1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var matrix_p1 = [line1p1,line2p1,line3p1,
                 line4p1,line5p1,line6p1,
                         centerp1,
                 line8p1,line9p1,line10p1,
                 line11p1,line12p1,line13p1];

// Create a list of weights for a 13x13 kernel.
//              1  2  3  4  5  6  7  8  9 10 11 12 13
var line1p2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line2p2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line3p2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line4p2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line5p2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line6p2 =  [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var centerp2 =[-1,-1,-1,-1, 1, 1, 1, 1, 1, 0, 0, 0, 0];
var line8p2 =  [0, 0, 0, 0,-1,-1,-1,-1,-1, 1, 1, 1, 1];
var line9p2 =  [0, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1,-1,-1];
var line10p2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line11p2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line12p2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var line13p2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var matrix_p2 = [line1p2,line2p2,line3p2,
                 line4p2,line5p2,line6p2,
                         centerp2,
                 line8p2,line9p2,line10p2,
                 line11p2,line12p2,line13p2];
                
// Create the kernel from the weights.
var kernelp1 = ee.Kernel.fixed(13, 13, matrix_p1);
var kernelp2 = ee.Kernel.fixed(13, 13, matrix_p2);

var convolvedP1 = STDMean.convolve(kernelp1);
var convolvedP2 = STDMean.convolve(kernelp2);
var conditionP1 = convolvedP1.gt(0)
var conditionP2 = convolvedP2.gt(0)
var conditionP12 = convolvedP1.updateMask(conditionP1)
                              .add(convolvedP2
                                   .updateMask(conditionP2))
                                               .gt(T)
                                               
var conditionP12 = conditionP12.updateMask(conditionP12)

var objectId = conditionP12.connectedComponents({
  connectedness: ee.Kernel.plus(1),
  maxSize: 256
});
//Map.addLayer(objectId.randomVisualizer(), null, 'Objects');
var objectSize = objectId.select('labels')
  .connectedPixelCount({
    maxSize: 256, eightConnected: ec
  });
var pixelArea = ee.Image.pixelArea();
var objectArea = objectSize.multiply(pixelArea);
var areaMask = objectArea.gte(CT);
var conditionP12 = ee.Algorithms.If(ConnectedComponents,
                                    conditionP12.updateMask(areaMask),
                                    conditionP12);

}

// COLLECT PROCESSED IMAGES
{
var convolveCollection = ee.ImageCollection([conditionA12,
                                             conditionB12,
                                             conditionC12,
                                             conditionD12,
                                             conditionE12,
                                             conditionF12,
                                             conditionG12,
                                             conditionH12,
                                             conditionI12,
                                             conditionJ12,
                                             conditionK12,
                                             conditionL12,
                                             conditionM12,
                                             conditionN12,
                                             conditionO12,
                                             conditionP12]);
}

// APPLY AND OR STATEMENT
var ConvolveOR = convolveCollection.reduce(ee.Reducer.anyNonZero()).clip(tRegion);

Map.addLayer(ConvolveOR, {bands: ['mean_any'], max: 0.5}, 'convolveOR_NIR');


// APPLY CONNECTED COMPONENT AFTER
/*{
var objectId = ConvolveOR.connectedComponents({
  connectedness: ee.Kernel.plus(1),
  maxSize: 256
});

var objectSize = objectId.select('labels')
  .connectedPixelCount({
    maxSize: 256, eightConnected: ec
  });

var pixelArea = ee.Image.pixelArea();
var objectArea = objectSize.multiply(pixelArea);
var areaMask = objectArea.gte(300);
var ConvolveOR = ConvolveOR.updateMask(areaMask);
}*/

Export.image.toDrive({image: ConvolveOR,
                      folder: "BoundaryLayers",
                      description: "Final_model_LCA",
                      region: tRegion,
                      scale: 10,
                      maxPixels: 50000000000});

//TRIALS
{
//Map.addLayer(ConvolveOR, {bands: ['mean_any'], max: 1}, 'convolveOR_NIR');

//Map.addLayer(ConvolveOR, {bands: ['B12_mean_stdDev_mean_any'], max: 0.5}, 'convolveOR_SWIR2');

/*var patchsize = ConvolveOR.connectedPixelCount(300, false);
var connectedMask = patchsize.gt(10);
var ConvolveOR = ConvolveOR.updateMask(connectedMask);
*/
//Map.addLayer(ConvolveOR, {bands: ['B8_mean_stdDev_mean_any'], max: 0.5}, 'convolveOR_NIR_processed');
//Map.addLayer(ConvolveOR, {bands: ['mean_any'], max: 0.5}, 'convolveOR_NIR_processed');
/*
var vectors = ConvolveOR.reduceToVectors({
  geometry: geometry,
  crs: ConvolveOR.projection(),
  scale: 8,
  geometryType: 'polygon',
  eightConnected: false,
  labelProperty: 'zone',
  reducer: ee.Reducer.mean()
});
*/
//Map.centerObject(geometry);
//print(vectors);

//Map.addLayer(vectors, {color: 'FF0000'}, 'vector');
}
