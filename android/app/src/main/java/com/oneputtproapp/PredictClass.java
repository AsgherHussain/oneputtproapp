package com.oneputtproapp;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import org.tensorflow.lite.Interpreter;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
public class PredictClass {

    float[][] h0;
    float[][] c0;

    public PredictClass() {
        h0 = new float[1][128];
        c0 = new float[1][128];
    }

    public int predict(Interpreter tfliteInterpreter,  float[][][]  inputArray) {

    Map<String, float[][]> obj = runInference(tfliteInterpreter,inputArray, this.h0,this.c0);
        h0 = obj.get("h0");
        c0 = obj.get("c0");
        float[][] output = obj.get("output");

        float[] result = output[0];
        List<Double> list = new ArrayList<Double>();
        for (float f : result) {
            list.add((double) f);
        }

        double max = Collections.max(list);
        int index = list.indexOf(max);

        return index;
    }

    private Map<String, float[][]> runInference(Interpreter tfliteInterpreter, float[][][]  inputData, float[][] h0, float[][] c0) {
      
        
// float[][][] inputData1=convertReadableArrayToFloatArray(inputData);
        Object[] inputs = {h0, inputData, c0};

        Map<Integer, Object> outputs = new HashMap<>();
        float[][] outputData = new float[1][3];
        float[][] h0Out = new float[1][128];
        float[][] c0Out = new float[1][128];

        outputs.put(0, outputData);
        outputs.put(1, h0Out);
        outputs.put(2, c0Out);

        tfliteInterpreter.runForMultipleInputsOutputs(inputs, outputs); 

        Map<String, float[][]> obj = new HashMap<>();
        obj.put("output", outputData);
        obj.put("h0", h0Out);
        obj.put("c0", c0Out);

        return obj;
    }
    public static float[][][] convertReadableArrayToFloatArray(ReadableArray inputData) {
        int depth = inputData.size();
        int rows = inputData.getArray(0).size();
        int columns = inputData.getArray(0).getArray(0).size();
    
        float[][][] result = new float[depth][rows][columns];
    
        for (int i = 0; i < depth; i++) {
            ReadableArray depthArray = inputData.getArray(i);
    
            for (int j = 0; j < rows; j++) {
                ReadableArray rowArray = depthArray.getArray(j);
    
                for (int k = 0; k < columns; k++) {
                    if (rowArray.getType(k) == ReadableType.Number) {
                        result[i][j][k] = (float) rowArray.getDouble(k);
                    } else {
                        // Handle error or default value if necessary
                        result[i][j][k] = 0.0f;
                    }
                }
            }
        }
    
        return result;
    }
    public float[][][] convertReadableArrayToFloat3DArray(ReadableArray readableArray) {
        int shape1 = 1;
        int shape2 = readableArray.size();
        int shape3 = readableArray.getArray(0).size();
    
        float[][][] float3DArray = new float[shape1][shape2][shape3];
    
        for (int i = 0; i < shape2; i++) {
            ReadableArray row = readableArray.getArray(i);
    
            for (int j = 0; j < shape3; j++) {
                ReadableType type = row.getType(j);
    
                switch (type) {
                    case Number:
                        float3DArray[0][i][j] = (float) row.getDouble(j);
                        break;
                    default:
                        // Handle other cases or set a default value if needed
                        break;
                }
            }
        }
    
        return float3DArray;
    }
    
    
      

      
}