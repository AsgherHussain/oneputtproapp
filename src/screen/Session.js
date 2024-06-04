import {View, Text, Button} from 'react-native';
import React, {useEffect} from 'react';
// import {FusionAhrs} from '../module/FusionAhrs';
// import {FusionOffset} from '../module/FusionOffset';
// import {FusionQuaternion} from '../module/FusionQuaternion';
// import {FusionSettings} from '../module/Fusionsettings';
// import {FusionVector} from '../module/FusionVector';
import {
  FusionAhrs,
  FusionOffset,
  FusionQuaternion,
  FusionVector,
  Fusionsettings,
} from '../module/Fusion';
import RNFS from 'react-native-fs';
import Papa from 'papaparse';
import TopButtons from '../components/TopButtons';
const csvFile = './sensor.csv';

const Session = () => {
  const data = [
    {
      'Time (s)': 0.0239646434783936,
      'Gyroscope X (deg/s)': -0.213740458015267,
      'Gyroscope Y (deg/s)': -0.366412213740458,
      'Gyroscope Z (deg/s)': 0.190839694656489,
      'Accelerometer X (g)': 0.052734375,
      'Accelerometer Y (g)': -0.302993280390959,
      'Accelerometer Z (g)': 0.94873046875,
      Label: 0,
    },
    {
      'Time (s)': 0.0717291831970215,
      'Gyroscope X (deg/s)': -0.175572519083969,
      'Gyroscope Y (deg/s)': -0.343511450381679,
      'Gyroscope Z (deg/s)': 0.251908396946565,
      'Accelerometer X (g)': 0.050048828125,
      'Accelerometer Y (g)': -0.305681124007331,
      'Accelerometer Z (g)': 0.944580078125,
      Label: 0,
    },
    {
      'Time (s)': 0.119192361831665,
      'Gyroscope X (deg/s)': -0.206106870229008,
      'Gyroscope Y (deg/s)': -0.33587786259542,
      'Gyroscope Z (deg/s)': 0.312977099236641,
      'Accelerometer X (g)': 0.033203125,
      'Accelerometer Y (g)': -0.275381795968235,
      'Accelerometer Z (g)': 0.9501953125,
      Label: 0,
    },
    {
      'Time (s)': 0.16600227355957,
      'Gyroscope X (deg/s)': -0.213740458015267,
      'Gyroscope Y (deg/s)': -0.290076335877863,
      'Gyroscope Z (deg/s)': 0.274809160305344,
      'Accelerometer X (g)': 0.04443359375,
      'Accelerometer Y (g)': -0.283200977397679,
      'Accelerometer Z (g)': 0.947998046875,
      Label: 0,
    },
    {
      'Time (s)': 0.212241888046265,
      'Gyroscope X (deg/s)': -0.198473282442748,
      'Gyroscope Y (deg/s)': -0.343511450381679,
      'Gyroscope Z (deg/s)': 0.190839694656489,
      'Accelerometer X (g)': 0.040771484375,
      'Accelerometer Y (g)': -0.299083689676237,
      'Accelerometer Z (g)': 0.942138671875,
      Label: 0,
    },
    {
      'Time (s)': 0.258992433547974,
      'Gyroscope X (deg/s)': -0.198473282442748,
      'Gyroscope Y (deg/s)': -0.297709923664122,
      'Gyroscope Z (deg/s)': 0.183206106870229,
      'Accelerometer X (g)': 0.043701171875,
      'Accelerometer Y (g)': -0.294929749541845,
      'Accelerometer Z (g)': 0.946533203125,
      Label: 0,
    },
    {
      'Time (s)': 0.305005073547363,
      'Gyroscope X (deg/s)': -0.221374045801527,
      'Gyroscope Y (deg/s)': -0.312977099236641,
      'Gyroscope Z (deg/s)': 0.16030534351145,
      'Accelerometer X (g)': 0.04296875,
      'Accelerometer Y (g)': -0.299816737935247,
      'Accelerometer Z (g)': 0.947021484375,
      Label: 0,
    },
    {
      'Time (s)': 0.353005170822144,
      'Gyroscope X (deg/s)': -0.236641221374046,
      'Gyroscope Y (deg/s)': -0.374045801526718,
      'Gyroscope Z (deg/s)': 0.175572519083969,
      'Accelerometer X (g)': 0.029052734375,
      'Accelerometer Y (g)': -0.28515577275504,
      'Accelerometer Z (g)': 0.948974609375,
      Label: 0,
    },
    {
      'Time (s)': 0.400992870330811,
      'Gyroscope X (deg/s)': -0.244274809160305,
      'Gyroscope Y (deg/s)': -0.320610687022901,
      'Gyroscope Z (deg/s)': 0.137404580152672,
      'Accelerometer X (g)': 0.044921875,
      'Accelerometer Y (g)': -0.327916921197312,
      'Accelerometer Z (g)': 0.945068359375,
      Label: 0,
    },
    {
      'Time (s)': 0.44706392288208,
      'Gyroscope X (deg/s)': -0.236641221374046,
      'Gyroscope Y (deg/s)': -0.312977099236641,
      'Gyroscope Z (deg/s)': 0.221374045801527,
      'Accelerometer X (g)': 0.039794921875,
      'Accelerometer Y (g)': -0.291508857666463,
      'Accelerometer Z (g)': 0.950927734375,
      Label: 0,
    },
    {
      'Time (s)': 0.495025396347046,
      'Gyroscope X (deg/s)': -0.229007633587786,
      'Gyroscope Y (deg/s)': -0.32824427480916,
      'Gyroscope Z (deg/s)': 0.290076335877863,
      'Accelerometer X (g)': 0.049072265625,
      'Accelerometer Y (g)': -0.295174098961515,
      'Accelerometer Z (g)': 0.948486328125,
      Label: 0,
    },
    {
      'Time (s)': 0.542033910751343,
      'Gyroscope X (deg/s)': -0.190839694656489,
      'Gyroscope Y (deg/s)': -0.33587786259542,
      'Gyroscope Z (deg/s)': 0.312977099236641,
      'Accelerometer X (g)': 0.04052734375,
      'Accelerometer Y (g)': -0.307147220525351,
      'Accelerometer Z (g)': 0.949462890625,
      Label: 0,
    },
    {
      'Time (s)': 0.588992118835449,
      'Gyroscope X (deg/s)': -0.137404580152672,
      'Gyroscope Y (deg/s)': -0.366412213740458,
      'Gyroscope Z (deg/s)': 0.244274809160305,
      'Accelerometer X (g)': 0.04150390625,
      'Accelerometer Y (g)': -0.312522907758094,
      'Accelerometer Z (g)': 0.945068359375,
      Label: 0,
    },
    {
      'Time (s)': 0.635191202163696,
      'Gyroscope X (deg/s)': -0.16793893129771,
      'Gyroscope Y (deg/s)': -0.389312977099237,
      'Gyroscope Z (deg/s)': 0.229007633587786,
      'Accelerometer X (g)': 0.037109375,
      'Accelerometer Y (g)': -0.289065363469762,
      'Accelerometer Z (g)': 0.94384765625,
      Label: 0,
    },
    {
      'Time (s)': 0.681171178817749,
      'Gyroscope X (deg/s)': -0.175572519083969,
      'Gyroscope Y (deg/s)': -0.389312977099237,
      'Gyroscope Z (deg/s)': 0.290076335877863,
      'Accelerometer X (g)': 0.050537109375,
      'Accelerometer Y (g)': -0.296395846059866,
      'Accelerometer Z (g)': 0.946533203125,
      Label: 0,
    },
    {
      'Time (s)': 0.72699236869812,
      'Gyroscope X (deg/s)': -0.236641221374046,
      'Gyroscope Y (deg/s)': -0.389312977099237,
      'Gyroscope Z (deg/s)': 0.290076335877863,
      'Accelerometer X (g)': 0.03515625,
      'Accelerometer Y (g)': -0.300794135613928,
      'Accelerometer Z (g)': 0.94873046875,
      Label: 0,
    },
    {
      'Time (s)': 0.775206565856934,
      'Gyroscope X (deg/s)': -0.183206106870229,
      'Gyroscope Y (deg/s)': -0.32824427480916,
      'Gyroscope Z (deg/s)': 0.610687022900763,
      'Accelerometer X (g)': 0.037353515625,
      'Accelerometer Y (g)': -0.314233353695785,
      'Accelerometer Z (g)': 0.961669921875,
      Label: 0,
    },
    {
      'Time (s)': 0.821191787719727,
      'Gyroscope X (deg/s)': -0.206106870229008,
      'Gyroscope Y (deg/s)': -0.312977099236641,
      'Gyroscope Z (deg/s)': 0.809160305343512,
      'Accelerometer X (g)': 0.034912109375,
      'Accelerometer Y (g)': -0.26731826511912,
      'Accelerometer Z (g)': 0.944091796875,
      Label: 0,
    },
    {
      'Time (s)': 0.866910696029663,
      'Gyroscope X (deg/s)': -0.099236641221374,
      'Gyroscope Y (deg/s)': -0.366412213740458,
      'Gyroscope Z (deg/s)': 0.83969465648855,
      'Accelerometer X (g)': 0.08154296875,
      'Accelerometer Y (g)': -0.307147220525351,
      'Accelerometer Z (g)': 0.937744140625,
      Label: 0,
    },
    {
      'Time (s)': 0.962046384811401,
      'Gyroscope X (deg/s)': -0.0458015267175573,
      'Gyroscope Y (deg/s)': -0.458015267175573,
      'Gyroscope Z (deg/s)': 0.0229007633587786,
      'Accelerometer X (g)': 0.060302734375,
      'Accelerometer Y (g)': -0.295662797800855,
      'Accelerometer Z (g)': 0.94580078125,
      Label: 0,
    },
    {
      'Time (s)': 1.01000452041626,
      'Gyroscope X (deg/s)': -0.0305343511450382,
      'Gyroscope Y (deg/s)': -0.679389312977099,
      'Gyroscope Z (deg/s)': 0.099236641221374,
      'Accelerometer X (g)': -0.04541015625,
      'Accelerometer Y (g)': -0.270250458155162,
      'Accelerometer Z (g)': 0.94580078125,
      Label: 0,
    },
    {
      'Time (s)': 1.05800127983093,
      'Gyroscope X (deg/s)': -0.221374045801527,
      'Gyroscope Y (deg/s)': -0.396946564885496,
      'Gyroscope Z (deg/s)': 0.473282442748092,
      'Accelerometer X (g)': 0.0205078125,
      'Accelerometer Y (g)': -0.296395846059866,
      'Accelerometer Z (g)': 0.97900390625,
      Label: 1,
    },
    {
      'Time (s)': 1.10600924491882,
      'Gyroscope X (deg/s)': -0.366412213740458,
      'Gyroscope Y (deg/s)': 4.54961832061069,
      'Gyroscope Z (deg/s)': 0.0458015267175573,
      'Accelerometer X (g)': -0.372314453125,
      'Accelerometer Y (g)': -0.356017104459377,
      'Accelerometer Z (g)': 1.016845703125,
      Label: 1,
    },
    {
      'Time (s)': 1.20000076293945,
      'Gyroscope X (deg/s)': -1.23664122137405,
      'Gyroscope Y (deg/s)': 7.94656488549618,
      'Gyroscope Z (deg/s)': -3.18320610687023,
      'Accelerometer X (g)': -0.35009765625,
      'Accelerometer Y (g)': -0.508491142333537,
      'Accelerometer Z (g)': 1.019775390625,
      Label: 1,
    },
    {
      'Time (s)': 1.2485454082489,
      'Gyroscope X (deg/s)': -2.51908396946565,
      'Gyroscope Y (deg/s)': 9.13740458015267,
      'Gyroscope Z (deg/s)': -2.76335877862595,
      'Accelerometer X (g)': -0.43408203125,
      'Accelerometer Y (g)': -0.394135613927917,
      'Accelerometer Z (g)': 1.0927734375,
      Label: 1,
    },
    {
      'Time (s)': 1.29520773887634,
      'Gyroscope X (deg/s)': -2.93893129770992,
      'Gyroscope Y (deg/s)': 10.2595419847328,
      'Gyroscope Z (deg/s)': -3.65648854961832,
      'Accelerometer X (g)': -0.271728515625,
      'Accelerometer Y (g)': -0.507269395235186,
      'Accelerometer Z (g)': 1.0869140625,
      Label: 1,
    },
    {
      'Time (s)': 1.29520773887634,
      'Gyroscope X (deg/s)': -3.63358778625954,
      'Gyroscope Y (deg/s)': 10.6412213740458,
      'Gyroscope Z (deg/s)': -2.74809160305344,
      'Accelerometer X (g)': -0.3037109375,
      'Accelerometer Y (g)': -0.378252901649359,
      'Accelerometer Z (g)': 1.04736328125,
      Label: 1,
    },
    {
      'Time (s)': 1.34202909469605,
      'Gyroscope X (deg/s)': -3.89312977099237,
      'Gyroscope Y (deg/s)': 11.1450381679389,
      'Gyroscope Z (deg/s)': -2.90076335877863,
      'Accelerometer X (g)': -0.147216796875,
      'Accelerometer Y (g)': -0.379474648747709,
      'Accelerometer Z (g)': 0.99169921875,
      Label: 1,
    },
    {
      'Time (s)': 1.39000368118286,
      'Gyroscope X (deg/s)': -3.87022900763359,
      'Gyroscope Y (deg/s)': 10.5190839694657,
      'Gyroscope Z (deg/s)': -2.40458015267176,
      'Accelerometer X (g)': -0.09423828125,
      'Accelerometer Y (g)': -0.300305436774588,
      'Accelerometer Z (g)': 0.956298828125,
      Label: 1,
    },
    {
      'Time (s)': 1.43723797798157,
      'Gyroscope X (deg/s)': -3.36641221374046,
      'Gyroscope Y (deg/s)': 8.14503816793893,
      'Gyroscope Z (deg/s)': -2.87786259541985,
      'Accelerometer X (g)': 0.049560546875,
      'Accelerometer Y (g)': -0.258766035430666,
      'Accelerometer Z (g)': 0.864501953125,
      Label: 1,
    },
    {
      'Time (s)': 1.48399686813355,
      'Gyroscope X (deg/s)': -3.00763358778626,
      'Gyroscope Y (deg/s)': 6.53435114503817,
      'Gyroscope Z (deg/s)': -2.21374045801527,
      'Accelerometer X (g)': 0.053466796875,
      'Accelerometer Y (g)': -0.202076970067196,
      'Accelerometer Z (g)': 0.842529296875,
      Label: 1,
    },
    {
      'Time (s)': 1.53117084503174,
      'Gyroscope X (deg/s)': -1.77099236641221,
      'Gyroscope Y (deg/s)': 2.93893129770992,
      'Gyroscope Z (deg/s)': -1.6030534351145,
      'Accelerometer X (g)': 0.08447265625,
      'Accelerometer Y (g)': -0.212583995113012,
      'Accelerometer Z (g)': 0.8369140625,
      Label: 1,
    },
    {
      'Time (s)': 1.5780189037323,
      'Gyroscope X (deg/s)': -0.580152671755725,
      'Gyroscope Y (deg/s)': -0.229007633587786,
      'Gyroscope Z (deg/s)': -1.12977099236641,
      'Accelerometer X (g)': 0.1455078125,
      'Accelerometer Y (g)': -0.241172877214417,
      'Accelerometer Z (g)': 0.81396484375,
      Label: 1,
    },
    {
      'Time (s)': 1.62601089477539,
      'Gyroscope X (deg/s)': 1.13740458015267,
      'Gyroscope Y (deg/s)': -4.48091603053435,
      'Gyroscope Z (deg/s)': 1.29770992366412,
      'Accelerometer X (g)': 0.096435546875,
      'Accelerometer Y (g)': -0.167623701893708,
      'Accelerometer Z (g)': 0.83935546875,
      Label: 1,
    },
    {
      'Time (s)': 1.67402195930481,
      'Gyroscope X (deg/s)': 1.77099236641221,
      'Gyroscope Y (deg/s)': -3.91603053435115,
      'Gyroscope Z (deg/s)': 1.6793893129771,
      'Accelerometer X (g)': 0.105224609375,
      'Accelerometer Y (g)': -0.271960904092853,
      'Accelerometer Z (g)': 0.813720703125,
      Label: 1,
    },
    {
      'Time (s)': 1.76699233055115,
      'Gyroscope X (deg/s)': 3.20610687022901,
      'Gyroscope Y (deg/s)': -9.10687022900763,
      'Gyroscope Z (deg/s)': 3.41221374045802,
      'Accelerometer X (g)': -0.011962890625,
      'Accelerometer Y (g)': -0.32376298106292,
      'Accelerometer Z (g)': 0.9326171875,
      Label: 1,
    },
    {
      'Time (s)': 1.8135232925415,
      'Gyroscope X (deg/s)': 3.24427480916031,
      'Gyroscope Y (deg/s)': -9.84732824427481,
      'Gyroscope Z (deg/s)': 4.25190839694657,
      'Accelerometer X (g)': -0.06689453125,
      'Accelerometer Y (g)': -0.290775809407453,
      'Accelerometer Z (g)': 1.004150390625,
      Label: 1,
    },
    {
      'Time (s)': 1.86002850532532,
      'Gyroscope X (deg/s)': 2.50381679389313,
      'Gyroscope Y (deg/s)': -11.3206106870229,
      'Gyroscope Z (deg/s)': 6.85496183206107,
      'Accelerometer X (g)': -0.100341796875,
      'Accelerometer Y (g)': -0.234331093463653,
      'Accelerometer Z (g)': 1.152099609375,
      Label: 1,
    },
    {
      'Time (s)': 1.90600228309631,
      'Gyroscope X (deg/s)': 2.74809160305344,
      'Gyroscope Y (deg/s)': -12.236641221374,
      'Gyroscope Z (deg/s)': 7.11450381679389,
      'Accelerometer X (g)': -0.137939453125,
      'Accelerometer Y (g)': -0.313500305436775,
      'Accelerometer Z (g)': 1.10498046875,
      Label: 1,
    },
    {
      'Time (s)': 1.95254993438721,
      'Gyroscope X (deg/s)': 3.08396946564885,
      'Gyroscope Y (deg/s)': -13.6870229007634,
      'Gyroscope Z (deg/s)': 6.05343511450382,
      'Accelerometer X (g)': -0.19580078125,
      'Accelerometer Y (g)': -0.366279780085522,
      'Accelerometer Z (g)': 1.150146484375,
      Label: 1,
    },
    {
      'Time (s)': 1.99917268753052,
      'Gyroscope X (deg/s)': 2.10687022900763,
      'Gyroscope Y (deg/s)': -14.2213740458015,
      'Gyroscope Z (deg/s)': 5.47328244274809,
      'Accelerometer X (g)': -0.27392578125,
      'Accelerometer Y (g)': -0.421991447770312,
      'Accelerometer Z (g)': 1.143310546875,
      Label: 1,
    },
    {
      'Time (s)': 2.04602336883545,
      'Gyroscope X (deg/s)': 0.648854961832061,
      'Gyroscope Y (deg/s)': -7.6793893129771,
      'Gyroscope Z (deg/s)': 1.24427480916031,
      'Accelerometer X (g)': 0.46875,
      'Accelerometer Y (g)': -0.441295051924252,
      'Accelerometer Z (g)': 0.927978515625,
      Label: 1,
    },
    {
      'Time (s)': 2.0940260887146,
      'Gyroscope X (deg/s)': 0.526717557251908,
      'Gyroscope Y (deg/s)': -6.16030534351145,
      'Gyroscope Z (deg/s)': 3.7175572519084,
      'Accelerometer X (g)': -0.14501953125,
      'Accelerometer Y (g)': -0.276359193646915,
      'Accelerometer Z (g)': 0.958740234375,
      Label: 1,
    },
    {
      'Time (s)': 2.14202189445496,
      'Gyroscope X (deg/s)': 0.129770992366412,
      'Gyroscope Y (deg/s)': -4.57251908396947,
      'Gyroscope Z (deg/s)': 3.27480916030534,
      'Accelerometer X (g)': -0.194091796875,
      'Accelerometer Y (g)': -0.352107513744655,
      'Accelerometer Z (g)': 0.91845703125,
      Label: 1,
    },
    {
      'Time (s)': 2.18900370597839,
      'Gyroscope X (deg/s)': -0.564885496183206,
      'Gyroscope Y (deg/s)': -2.83969465648855,
      'Gyroscope Z (deg/s)': 2.23664122137405,
      'Accelerometer X (g)': -0.063232421875,
      'Accelerometer Y (g)': -0.301527183872938,
      'Accelerometer Z (g)': 0.905517578125,
      Label: 1,
    },
    {
      'Time (s)': 2.23603940010071,
      'Gyroscope X (deg/s)': -0.793893129770992,
      'Gyroscope Y (deg/s)': -2.51908396946565,
      'Gyroscope Z (deg/s)': 2.02290076335878,
      'Accelerometer X (g)': 0.0615234375,
      'Accelerometer Y (g)': -0.239951130116066,
      'Accelerometer Z (g)': 0.90771484375,
      Label: 1,
    },
    {
      'Time (s)': 2.23603940010071,
      'Gyroscope X (deg/s)': -0.854961832061069,
      'Gyroscope Y (deg/s)': -2.58778625954198,
      'Gyroscope Z (deg/s)': 1.65648854961832,
      'Accelerometer X (g)': 0.09521484375,
      'Accelerometer Y (g)': -0.24825901038485,
      'Accelerometer Z (g)': 0.905517578125,
      Label: 1,
    },
    {
      'Time (s)': 2.28400802612305,
      'Gyroscope X (deg/s)': -0.763358778625954,
      'Gyroscope Y (deg/s)': -2.6030534351145,
      'Gyroscope Z (deg/s)': 1.50381679389313,
      'Accelerometer X (g)': 0.124755859375,
      'Accelerometer Y (g)': -0.279535736102627,
      'Accelerometer Z (g)': 0.908203125,
      Label: 1,
    },
    {
      'Time (s)': 2.33200216293335,
      'Gyroscope X (deg/s)': -0.66412213740458,
      'Gyroscope Y (deg/s)': -2.68702290076336,
      'Gyroscope Z (deg/s)': 2.74045801526718,
      'Accelerometer X (g)': 0.126220703125,
      'Accelerometer Y (g)': -0.265363469761759,
      'Accelerometer Z (g)': 0.95654296875,
      Label: 1,
    },
    {
      'Time (s)': 2.38000345230103,
      'Gyroscope X (deg/s)': -0.587786259541985,
      'Gyroscope Y (deg/s)': -2.54198473282443,
      'Gyroscope Z (deg/s)': 0,
      'Accelerometer X (g)': 0.099365234375,
      'Accelerometer Y (g)': -0.306902871105681,
      'Accelerometer Z (g)': 0.943603515625,
      Label: 1,
    },
    {
      'Time (s)': 2.47602081298828,
      'Gyroscope X (deg/s)': -0.541984732824428,
      'Gyroscope Y (deg/s)': -1.53435114503817,
      'Gyroscope Z (deg/s)': 1.10687022900763,
      'Accelerometer X (g)': 0.098876953125,
      'Accelerometer Y (g)': -0.300061087354918,
      'Accelerometer Z (g)': 0.917236328125,
      Label: 0,
    },
    {
      'Time (s)': 2.52238702774048,
      'Gyroscope X (deg/s)': -0.488549618320611,
      'Gyroscope Y (deg/s)': -0.83206106870229,
      'Gyroscope Z (deg/s)': 0.572519083969466,
      'Accelerometer X (g)': 0.107421875,
      'Accelerometer Y (g)': -0.298350641417227,
      'Accelerometer Z (g)': 0.91943359375,
      Label: 0,
    },
  ];
  const calculation = file => {
    let multiValues = new Map();
    let data = [];
    let gyroscope = [];
    let timestamp = [];
    let accelerometer = [];
    let delimiter = ',';
    let line;
    let lines = [];

    let backstroke = null;
    let front_stroke = null;
    //let takeaway = null;
    let ratio_back_front = null;
    let elevation_impact = null;
    let centre_front = null;
    let velocity_abs = null;
    let diff_yaw = null;
    let roll_start = null;
    let roll_impact = null;
    let pos_y_impact = null;
    let pitch_impact = null;
    let loft_angle = null;
    let avg_score = null;

    let sharedInt = 0;

    try {
     
      for (let i = 0; i < file.length; i++) {
        let array1 = file[i];
        
        timestamp.push(array1['Time (s)']);
        let gyroscopeArray = [];
        //Array of gyroscope

        gyroscopeArray.push([
          array1['Gyroscope X (deg/s)'],
          array1['Gyroscope Y (deg/s)'],
          array1['Gyroscope Z (deg/s)'],
        ]);
        gyroscope.push(gyroscopeArray);

        //Array of accelerometer
        let accelerometerArray = [];

        accelerometerArray.push([
          array1['Accelerometer X (g)'],
          array1['Accelerometer Y (g)'],
          array1['Accelerometer Z (g)'],
        ]);

        accelerometer.push(accelerometerArray);
      }
      timestamp;
      gyroscope;
      accelerometer;

      const sample_rate = 50;
      const THRESHOLD = 0.5;
      const AHRS = new FusionAhrs(0.5, 10, 0, 1 * sample_rate);
      const acceleration = [];
      var delta_time;
      const euler = [];

      const velocity = [];
      let delta_timediff = 0;

    
      function calculateDeltaTime(timestamp) {
        const deltaTime = timestamp.map((value, index, array) => {
          if (index === 0) {
            return 0; // Prepend the first timestamp with 0
          }
          return value - array[index - 1]; // Calculate the difference
        });

        return deltaTime;
      }
      delta_time = calculateDeltaTime(timestamp);
      let FusionOffsetObj = new FusionOffset(sample_rate);
      let euler1 = null;
      let euler_time = [];

      for (let index = 0; index < accelerometer.length; index++) {
        let FusionVectorObj = new FusionVector(
          parseFloat(gyroscope[index][0][0]),
          parseFloat(gyroscope[index][0][1]),
          parseFloat(gyroscope[index][0][2]),
        );
        let gyroscope_vec = FusionOffsetObj.FusionOffsetUpdate(
          FusionVectorObj,
          THRESHOLD,
        );

        let accelerometer_vec = new FusionVector(
          parseFloat(accelerometer[index][0][0]),
          parseFloat(accelerometer[index][0][1]),
          parseFloat(accelerometer[index][0][2]),
        );

        AHRS.FusionAhrsUpdateNoMagnetometer(
          gyroscope_vec,
          accelerometer_vec,
          delta_time[index],
        );
        let acceleration_vec = new FusionVector(0, 0, 0);
        euler1 = AHRS.QuaternionToEuler();
        euler_time.push([
          {
            0: parseFloat(timestamp[index]),
            1: parseFloat(euler1['roll']),
            2: parseFloat(euler1['pitch']),
            3: parseFloat(euler1['yaw']),
          },
        ]);
       

        acceleration_vec = AHRS.FusionGetEarthAcceleration();
      
        acceleration.push([
          {
            0: acceleration_vec.x * 9.80665,
            1: acceleration_vec.y * 9.80665,
            2: acceleration_vec.z * 9.80665,
          },
        ]);
      }

   
      // Create the boolean array
      let bool_arr = new Array(gyroscope.length)
        .fill(0)
        .map(() => new Array(gyroscope[0].length).fill(false));

      for (let i = 0; i < gyroscope.length; i++) {
        for (let j = 0; j < gyroscope[i].length; j++) {
          bool_arr[i][j] =
            parseFloat(gyroscope[i][j]) > -3 && parseFloat(gyroscope[i][j]) < 3;
        }
      }
      // Create a new 2-dimensional double array with zero gyro values

      let zero_gyro = new Array(gyroscope.length)
        .fill(0)
        .map(() => new Array(gyroscope[0].length).fill(0));

      for (let i = 0; i < gyroscope.length; i++) {
        for (let j = 0; j < gyroscope[i].length; j++) {
          if (bool_arr[i][j]) {
            zero_gyro[i][j] = 0;
          } else {
            zero_gyro[i][j] = parseFloat(gyroscope[i][j]);
          }
        }
      }

      // Create a new 2-dimensional double array called new_gyroscope
      let new_gyroscope = new Array(gyroscope.length)
        .fill(0)
        .map(() => new Array(4).fill(0));
      // Set first column of new array to timestamp value
      for (let i = 0; i < gyroscope.length; i++) {
        new_gyroscope[i][0] = parseFloat(timestamp[i]);
      }
      // Copy contents of zero_gyro to remaining three columns of new array
      for (let i = 0; i < gyroscope.length; i++) {
        for (let j = 1; j < 4; j++) {
          new_gyroscope[i][j] = zero_gyro[i][j - 1];
        }
      }
      // Get the indices where columns 2, 3, and 4 have at least one non-zero value
      let idx = new Array(new_gyroscope.length);
      let count = 0;

      for (let i = 0; i < new_gyroscope.length; i++) {
        if (
          new_gyroscope[i][1] !== 0 ||
          new_gyroscope[i][2] !== 0 ||
          new_gyroscope[i][3] !== 0
        ) {
          idx[count] = i;
          count++;
        }
      }

      idx = idx.slice(0, count);
      // get the last value of column 1 where the condition is satisfied
      let motion_stopped = new_gyroscope[idx[idx.length - 1]][0];

      let new_acceleration = new Array(acceleration.length);
      for (let i = 0; i < acceleration.length; i++) {
        new_acceleration[i] = new Array(4);
        new_acceleration[i][0] = parseFloat(timestamp[i]);
      }

      for (let i = 0; i < acceleration.length; i++) {
        for (let j = 1; j < 4; j++) {
          new_acceleration[i][j] = acceleration[i][j - 1];
        }
      }

      let idx1 = -1;
      for (let i = 0; i < new_acceleration.length; i++) {
        if (new_acceleration[i][0] === motion_stopped) {
          idx1 = i;
          break;
        }
      }

      if (idx1 < 0) idx1 = -idx1 - 2;

      for (let i = idx1 + 1; i < new_acceleration.length; i++) {
        for (let j = 1; j < new_acceleration[i].length; j++) {
          new_acceleration[i][j] = 0;
        }
      }

      for (let i = 0; i < new_acceleration.length; i++) {
        for (let j = 0; j < acceleration[i].length; j++) {
          acceleration[i][j] = new_acceleration[i][j + 1];
        }
      }
      var is_moving = new Array(timestamp.length);
      for (var index = 0; index < timestamp.length; index++) {
        var acceleration_magnitude = Math.sqrt(
          Math.pow(acceleration[index][0], 2) +
            Math.pow(acceleration[index][1], 2) +
            Math.pow(acceleration[index][2], 2),
        );

        is_moving[index] = acceleration_magnitude > 1.8; // threshold = 3 m/s/s
      }
      var margin = Math.floor(0.1 * sample_rate); // 100 ms
      for (var index1 = 0; index1 < timestamp.length - margin; index1++) {
        var moving = false;
        for (var i = index1; i < index1 + margin; i++) {
          moving = moving || is_moving[i]; // check if any value in the window is true
        }
        is_moving[index1] = moving; // leading margin
      }

      for (var index2 = timestamp.length - 1; index2 > margin; index2--) {
        var anyMoving = false;
        for (var i = index2 - margin; i < index2; i++) {
          if (is_moving[i]) {
            anyMoving = true;
            break;
          }
        }
        is_moving[index2] = anyMoving;
      }

      for (var index = 1; index < timestamp.length; index++) {
        if (is_moving[index]) {
          for (var axis = 0; axis < 3; axis++) {
            velocity[index][axis] =
              velocity[index - 1][axis] +
              delta_time[index] * acceleration[index][axis];
          }
        }
      }

      var is_moving1 = new Array(timestamp.length);
      for (var index = 0; index < is_moving.length; index++) {
        if (is_moving[index] === false) {
          is_moving1[index] = 0;
        } else {
          is_moving1[index] = 1;
        }
      }
      // Find start and stop indices of each moving period
      var is_moving_diff = new Array(timestamp.length);
      for (var index = 0; index < timestamp.length - 1; index++) {
        is_moving_diff[index] = is_moving1[index + 1] - is_moving1[index];
      }

      for (var i = 0; i < is_moving_diff.length; i++) {
        // Code block intentionally left blank as it is empty in the original code
      }
      class IsMovingPeriod {
        constructor() {
          this.start_index = -1;
          this.stop_index = -1;
        }
      }

      var is_moving_periods = [];
      var is_moving_period = new IsMovingPeriod();

      for (var index = 0; index < timestamp.length; index++) {
        if (is_moving_period.start_index === -1) {
          if (is_moving_diff[index] === 1) {
            is_moving_period.start_index = index;
          }
        } else if (is_moving_period.stop_index === -1) {
          if (is_moving_diff[index] === -1) {
            is_moving_period.stop_index = index;
            is_moving_periods.push(is_moving_period);
            is_moving_period = new IsMovingPeriod();
          }
        }
      }
      var timestamp1 = [];
      for (var i = 0; i < timestamp.length; i++) {
        var value = parseFloat(timestamp[i]);
        timestamp1.push(value);
      }

      var velocity_drift = new Array(timestamp.length);
      for (var i = 0; i < timestamp.length; i++) {
        velocity_drift[i] = new Array(3);
      }

      for (var k = 0; k < is_moving_periods.length; k++) {
        var is_moving_period1 = is_moving_periods[k];
        var start_index = is_moving_period1.start_index;
        var stop_index = is_moving_period1.stop_index;

        var t = [
          parseFloat(timestamp[start_index]),
          parseFloat(timestamp[stop_index]),
        ];

        var x = [velocity[start_index][0], velocity[stop_index][0]];
        var y = [velocity[start_index][1], velocity[stop_index][1]];
        var z = [velocity[start_index][2], velocity[stop_index][2]];
        var t_new = timestamp1.slice(start_index, stop_index + 1);

        var interpolator = new Interpolator();
        velocity_drift[start_index][0] = interpolator
          .interpolate(t, x)
          .value(t_new[0]);
        velocity_drift[start_index][1] = interpolator
          .interpolate(t, y)
          .value(t_new[0]);
        velocity_drift[start_index][2] = interpolator
          .interpolate(t, z)
          .value(t_new[0]);

        for (var i = 1; i < t_new.length; i++) {
          velocity_drift[start_index + i][0] = interpolator
            .interpolate(t, x)
            .value(t_new[i]);
          velocity_drift[start_index + i][1] = interpolator
            .interpolate(t, y)
            .value(t_new[i]);
          velocity_drift[start_index + i][2] = interpolator
            .interpolate(t, z)
            .value(t_new[i]);
        }
      }
      for (var i = 0; i < velocity.length; i++) {
        velocity[i][0] -= velocity_drift[i][0];
        velocity[i][1] -= velocity_drift[i][1];
        velocity[i][2] -= velocity_drift[i][2];

        if (i > idx1) {
          velocity[i][0] = 0;
          velocity[i][1] = 0;
          velocity[i][2] = 0;
        }
      }

      var sr = 12;
      // Calculate position
      var position = new Array(timestamp.length - sr);
      for (var i = 0; i < position.length; i++) {
        position[i] = new Array(3);
      }

      velocity = velocity.slice(sr);
      var centripetal_velocity = 0.0;
      for (var i = 0; i < velocity.length; i++) {
        centripetal_velocity = Math.pow(velocity[i][2], 2.0) / 0.8;
        velocity[i][2] = velocity[i][2] - centripetal_velocity;
      }

      timestamp.splice(0, sr);
      delta_time.splice(0, sr);
      for (var index = 1; index < timestamp.length; index++) {
        var previousPosition = position[index - 1];
        var deltaTime = delta_time[index];
        var currentVelocity = velocity[index];
        for (var i = 0; i < 3; i++) {
          position[index][i] =
            previousPosition[i] + deltaTime * currentVelocity[i];
        }
      }
      var new_position = new Array(position.length);
      for (var i = 0; i < position.length; i++) {
        new_position[i] = new Array(4);
        new_position[i][0] = parseFloat(timestamp[i]);
        for (var j = 0; j < 3; j++) {
          new_position[i][j + 1] = position[i][j];
        }
      }
      var ReturnValues = front_back_split(new_position, velocity, euler_time);

      centre_front = ReturnValues['centre_front'];
      backstroke = ReturnValues['backstroke'];
      front_stroke = ReturnValues['front_stroke'];
      ratio_back_front = ReturnValues['ratio_back_front'];
      elevation_impact = ReturnValues['elevation_impact'];

      velocity_abs = ReturnValues['velocity_abs'];
      sharedInt = Math.floor(ReturnValues['splitIndex']);
      diff_yaw = ReturnValues['diff_yaw'];
      roll_start = ReturnValues['roll_start'];
      roll_impact = ReturnValues['roll_impact'];
      pos_y_impact = ReturnValues['pos_y_impact'];
      pitch_impact = ReturnValues['pitch_impact'];
      diff_yaw = ReturnValues['diff_yaw'];
      loft_angle = ReturnValues['loft_angle'];
      avg_score = ReturnValues['avg_score'];
    } catch (error) {
      console.log(error);
    }
    multiValues = {
      backstroke: backstroke,
      front_stroke: front_stroke,
      splitIndex: sharedInt,
      ratio_back_front: ratio_back_front,
      elevation_impact: elevation_impact,
      centre_front: centre_front,
      velocity_abs: velocity_abs,
      diff_yaw: diff_yaw,
      roll_start: roll_start,
      roll_impact: roll_impact,
      pos_y_impact: pos_y_impact,
      pitch_impact: pitch_impact,
      diff_yaw: diff_yaw,
      loft_angle: loft_angle,
      avg_score: avg_score,
    };

    return multiValues;
  };
  const front_back_split = (pos, velocity, euler_time) => {
    const multiValuesReturn = {};

    let column_index = 1;
    const zero_rows = [];
    for (let i = 0; i < pos.length; i++) {
      if (pos[i][column_index] === 0) {
        zero_rows.push(i);
      }
    }

    let pos_time_index = 0;
    const pos_time = [];
    for (let i = 0; i < pos.length; i++) {
      if (!zero_rows.includes(i)) {
        pos_time[pos_time_index] = pos[i];
        pos_time_index++;
      }
    }

    const mask = new Array(pos_time.length);
    mask[0] = false;
    for (let i = 1; i < pos_time.length; i++) {
      mask[i] = !arraysEqual(pos_time[i], pos_time[i - 1]);
    }

    for (let i = 0; i < pos_time.length; i++) {
      if (mask[i] === false) {
        pos_time[i].fill(0);
      }
    }

    let numNonZeroRows = 0;
    for (let i = 0; i < pos_time.length; i++) {
      let isZeroRow = true;
      for (let j = 0; j < pos_time[0].length; j++) {
        if (pos_time[i][j] !== 0.0) {
          isZeroRow = false;
          break;
        }
      }
      if (!isZeroRow) {
        if (i !== numNonZeroRows) {
          // Move the non-zero row to its new position
          pos_time[numNonZeroRows] = pos_time[i];
        }
        numNonZeroRows++;
      }
    }

    // Update the length of the array
    pos_time.length = numNonZeroRows;

    const pos_time_x = new Array(pos_time.length);
    for (let m = 0; m < pos_time.length; m++) {
      pos_time_x[m] = pos_time[m][1];
    }

    let lowest_neg = Number.POSITIVE_INFINITY;
    let cutoff_idx = -1;
    for (let i = 0; i < pos_time_x.length; i++) {
      if (pos_time_x[i] < 0 && pos_time_x[i] < lowest_neg) {
        lowest_neg = pos_time_x[i];
        cutoff_idx = i;
      }
    }

    const backstroke = pos_time.slice(0, cutoff_idx);
    const front_stroke = pos_time.slice(cutoff_idx);

    const frontStrokeX = new Array(front_stroke.length);
    for (let i = 0; i < front_stroke.length; i++) {
      frontStrokeX[i] = front_stroke[i][1];
    }

    const arrayX = [];
    for (let i = 0; i < frontStrokeX.length; i++) {
      let x = frontStrokeX[i];
      if (x > 0) {
        x = 0 + x;
      } else {
        x = 0 - x;
      }
      arrayX.push(x);
    }

    const arrayXArr = new Array(arrayX.length);
    for (let i = 0; i < arrayX.length; i++) {
      arrayXArr[i] = arrayX[i];
    }

    let splitIndex = 0;
    for (let i = 0; i < arrayXArr.length; i++) {
      if (arrayXArr[i] < arrayXArr[splitIndex]) {
        splitIndex = i;
      }
    }

    const arr1 = pos_time.slice(0, splitIndex);
    const centre_front = pos_time.slice(splitIndex);


    const backstroke_time =
      backstroke[backstroke.length - 1][0] - backstroke[1][0];
    const front_impact_time =
      centre_front[centre_front.length - 1][0] -
      backstroke[backstroke.length - 2][0];

    const num1 = front_impact_time / backstroke_time;
    const ratio_back_front = num1.toFixed(2) + ':1';

    const elevation_impact = centre_front[0][3] * 100;
    const pos_y_impact = pos_time[0][2] - centre_front[0][2];
    const loft_angle = 1.1 - elevation_impact / 2.1;
    const velocity_abs = velocity.map(v =>
      Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2),
    );

    const start_time = pos_time[0][0];
    let index_start = -1;
    for (let i = 0; i < euler_time.length; i++) {
      if (euler_time[i][0] === start_time) {
        index_start = i;
        break;
      }
    }
    let yaw_start = 0.0;
    let roll_start = 0.0;
    if (index_start !== -1) {
      roll_start = euler_time[index_start][1];
      roll_start += 90;
      yaw_start = euler_time[index_start][3];
    }

    const impact_time = centre_front[0][0];
    let index_impact = -1;
    let roll_impact = 0.0;
    for (let i = 0; i < euler_time.length; i++) {
      if (euler_time[i][0] === impact_time) {
        index_impact = i;
        break;
      }
    }
    if (index_impact !== -1) {
      roll_impact = euler_time[index_impact][1];
      roll_impact += 90;
    }

    let diff_yaw = 0.0;
    if (index_impact !== -1) {
      const yaw_impact = euler_time[index_impact][3];
      diff_yaw = yaw_start - yaw_impact;
      backstroke[0][1] = 0;
      backstroke[0][2] = 0;
      backstroke[0][3] = 0;
    }

    let pitch_impact = 0.0;
    if (index_impact !== -1) {
      pitch_impact = euler_time[index_impact][2];
    }

    

    for (let i = 0; i < front_stroke.length; i++) {
      if (i === 0) {
        console.log(
          'front_stroke: ' + i,
          front_stroke[i][0] +
            ',' +
            front_stroke[i][1] +
            ',' +
            front_stroke[i][2],
        );
      } else if (front_stroke.length - 1 === i) {
       
      }
    }

    for (let i = 0; i < centre_front.length; i++) {
      if (i === 0) {
       
      }
    }

    const score = [];
    let avg = 0;
    score[0] = 10 - Math.abs(0.5 - num1);
    score[1] = 10 - Math.abs(0 - elevation_impact);
    score[2] = loft_angle;
    score[3] = 10 - Math.abs(0 - pos_y_impact);
    score[4] = 10 - Math.abs(70 - roll_start);
    score[5] = 10 - Math.abs(70 - roll_impact);
    score[6] = 10 - Math.abs(0 - diff_yaw);
    avg = (score.reduce((sum, s) => sum + s, 0) / score.length) * 10;
    score[7] = Math.floor(avg);


    multiValuesReturn['centre_front'] = centre_front;
    multiValuesReturn['backstroke'] = backstroke;
    multiValuesReturn['front_stroke'] = front_stroke;
    multiValuesReturn['ratio_back_front'] = ratio_back_front;
    multiValuesReturn['elevation_impact'] = elevation_impact;
    multiValuesReturn['velocity_abs'] = velocity_abs;
    multiValuesReturn['splitIndex'] = splitIndex;
    multiValuesReturn['diff_yaw'] = diff_yaw;
    multiValuesReturn['roll_start'] = roll_start;
    multiValuesReturn['roll_impact'] = roll_impact;
    multiValuesReturn['pos_y_impact'] = pos_y_impact;
    multiValuesReturn['pitch_impact'] = pitch_impact;
    multiValuesReturn['diff_yaw'] = diff_yaw;
    multiValuesReturn['loft_angle'] = loft_angle;
    multiValuesReturn['avg_score'] = String(score[7]);

    return multiValuesReturn;
  };
  return (
    <>
      <TopButtons />

      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: 'red'}}>Session</Text>
        <Button title="calculation" onPress={() => calculation(data)}></Button>
      </View>
    </>
  );
};

export default Session;
