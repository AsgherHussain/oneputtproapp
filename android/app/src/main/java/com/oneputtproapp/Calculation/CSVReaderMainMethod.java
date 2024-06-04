package com.oneputtproapp.Calculation;


import android.util.Log;

import org.apache.commons.math3.analysis.interpolation.LinearInterpolator;
import org.apache.commons.math3.analysis.interpolation.UnivariateInterpolator;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CSVReaderMainMethod {


    public static Map calculation(List<float[]> file, int Threshold, String[] ScoreData) {
        Map<String, Object> multiValues = new HashMap<String, Object>();
        ArrayList<String> data = new ArrayList<String>();
        List<List<String>> gyroscope = new ArrayList<>();
        ArrayList<String> timestamp = new ArrayList<String>();
        List<List<String>> accelerometer = new ArrayList<>();
        String delimiter = ",";
        String line;
        List<List<String>> lines = new ArrayList();

        Object backstroke = null;
        Object front_stroke = null;
        //Object takeaway = null;
        Object ratio_back_front = null;
        Object elevation_impact = null;
        Object centre_front = null;
        Object velocity_abs = null;
        Object diff_yaw = null;
        Object roll_start = null;
        Object roll_impact = null;
        Object pos_y_impact = null;
        Object pitch_impact = null;
        Object front_impact_time = null;
        Object backstroke_time = null;
        Object loft_angle = null;
        Object accelerationImpact = null;
        Object avgScore = null;


        int sharedInt = 0;


        //try (BufferedReader br = new BufferedReader(new FileReader(file))) {
        try {


            for (int i = 0; i < file.size(); i++) {
                float[] array1 = file.get(i);
                //Log.e( "array1 : ", String.valueOf(array1[1]));
                //Array of timestamp
                timestamp.add(String.valueOf(array1[0]));
                ArrayList<String> gyroscopeArray = new ArrayList<String>();
                //Array of gyroscope
                for (int j = 1; j < 4; j++) {
                    gyroscopeArray.add(String.valueOf(array1[j]));
                }
                gyroscope.add(gyroscopeArray);

                //Array of accelerometer
                ArrayList<String> accelerometerArray = new ArrayList<String>();
                for (int a = 4; a < 7; a++) {
                    accelerometerArray.add(String.valueOf(array1[a]));

                }
                accelerometer.add(accelerometerArray);
            }
            timestamp.remove(0);
            gyroscope.remove(0);
            accelerometer.remove(0);

            final int sample_rate = 100;
            double THRESHOLD = 1.5;
            FusionAhrs AHRS = new FusionAhrs(0.5, 10, 0, sample_rate);
            double[][] acceleration = new double[timestamp.size()][3];
            ArrayList<Double> delta_time = new ArrayList<Double>();
            double[][] euler = new double[timestamp.size()][3];


            double[][] velocity = new double[timestamp.size()][3];
            double delta_timediff = 0;

            for (int i = 0; i < timestamp.size(); i++) {
                if (i == 0) {
                    delta_timediff = Double.parseDouble(timestamp.get(i)) - Double.parseDouble(timestamp.get(i));
                    delta_time.add(delta_timediff);
                }
                for (int j = i + 1; j < timestamp.size(); j++) {
                    delta_timediff = Double.parseDouble(timestamp.get(j)) - Double.parseDouble(timestamp.get(i));
                    delta_time.add(delta_timediff);

                    break;
                }

            }

            FusionOffset FusionOffsetObj = new FusionOffset(sample_rate);
            Map euler1 = null;
            double[][] euler_time = new double[timestamp.size()][4];

            for (int index = 0; index < accelerometer.size(); index++) {

                FusionVector FusionVectorObj = new FusionVector(Double.parseDouble(gyroscope.get(index).get(0)),
                        Double.parseDouble(gyroscope.get(index).get(1)),
                        Double.parseDouble(gyroscope.get(index).get(2)));
                FusionVector gyroscope_vec = FusionOffsetObj.FusionOffsetUpdate(FusionVectorObj, THRESHOLD);

                FusionVector accelerometer_vec = new FusionVector(Double.parseDouble(accelerometer.get(index).get(0)),
                        Double.parseDouble(accelerometer.get(index).get(1)),
                        Double.parseDouble(accelerometer.get(index).get(2)));

                AHRS.FusionAhrsUpdateNoMagnetometer(gyroscope_vec, accelerometer_vec, delta_time.get(index));
                FusionVector acceleration_vec = new FusionVector(0, 0, 0);
                euler1 = AHRS.QuaternionToEuler();

                euler_time[index][0] = Double.parseDouble(timestamp.get(index));
                euler_time[index][1] = Double.parseDouble(String.valueOf(euler1.get("roll")));
                euler_time[index][2] = Double.parseDouble(String.valueOf(euler1.get("pitch")));
                euler_time[index][3] = Double.parseDouble(String.valueOf(euler1.get("yaw")));


                acceleration_vec = AHRS.FusionGetEarthAcceleration();
                acceleration[index][0] = acceleration_vec.x * 9.80665;
                acceleration[index][1] = acceleration_vec.y * 9.80665;
                acceleration[index][2] = acceleration_vec.z * 9.80665;
            }

            Log.e("euler_time: ", String.valueOf(euler_time.length));
            Log.e("timestamp: ", String.valueOf(timestamp.size()));


            // Create the boolean array
            boolean[][] bool_arr = new boolean[gyroscope.size()][gyroscope.get(0).size()];
            for (int i = 0; i < gyroscope.size(); i++) {
                for (int j = 0; j < gyroscope.get(i).size(); j++) {
                    bool_arr[i][j] = (Double.parseDouble(gyroscope.get(i).get(j)) > -3
                            && Double.parseDouble(gyroscope.get(i).get(j)) < 3);

                }

            }
            // Create a new 2-dimensional double array with zero gyro values
            double[][] zero_gyro = new double[gyroscope.size()][gyroscope.get(0).size()];
            for (int i = 0; i < gyroscope.size(); i++) {
                for (int j = 0; j < gyroscope.get(i).size(); j++) {
                    if (bool_arr[i][j]) {
                        zero_gyro[i][j] = 0;
                    } else {
                        zero_gyro[i][j] = Double.parseDouble(gyroscope.get(i).get(j));
                    }
                }

            }

            // Create a new 2-dimensional double array called new_gyroscope
            double[][] new_gyroscope = new double[gyroscope.size()][4];

            // Set first column of new array to timestamp value

            for (int i = 0; i < gyroscope.size(); i++) {

                new_gyroscope[i][0] = Double.parseDouble(timestamp.get(i));
            }

            // Copy contents of zero_gyro to remaining three columns of new array
            for (int i = 0; i < gyroscope.size(); i++) {
                System.arraycopy(zero_gyro[i], 0, new_gyroscope[i], 1, 3);
            }

            // Get the indices where columns 2, 3, and 4 have at least one non-zero value

            int[] idx = new int[new_gyroscope.length];
            int count = 0;
            for (int i = 0; i < new_gyroscope.length; i++) {
                if (new_gyroscope[i][1] != 0 || new_gyroscope[i][2] != 0 || new_gyroscope[i][3] != 0) {
                    idx[count] = i;
                    count++;
                }
            }
            idx = Arrays.copyOfRange(idx, 0, count);

            // get the last value of column 1 where the condition is satisfied
            double motion_stopped = new_gyroscope[idx[idx.length - 1]][0];

            double[][] new_acceleration = new double[acceleration.length][4];
            for (int i = 0; i < acceleration.length; i++) {

                new_acceleration[i][0] = Double.parseDouble(timestamp.get(i));
            }
            for (int i = 0; i < acceleration.length; i++) {
                System.arraycopy(acceleration[i], 0, new_acceleration[i], 1, 3);
            }

            int idx1 = -1; // initialize the index to -1
            for (int i = 0; i < new_acceleration.length; i++) {
                if (new_acceleration[i][0] == motion_stopped) { // check if the value in column 1 of the ith row equals
                    // motion_stopped
                    idx1 = i; // set the index to the ith row
                    break; // exit the loop as soon as a match is found
                }
            }

            // index=40
            if (idx1 < 0)
                idx1 = -idx1 - 2; // Get the index of the row with the value motionStopped in column 1

            for (int i = idx1 + 1; i < new_acceleration.length; i++) {
                for (int j = 1; j < new_acceleration[i].length; j++) {
                    new_acceleration[i][j] = 0; // Set all values in columns 2, 3, and 4 after the row with the index
                }
            }

            for (int i = 0; i < new_acceleration.length; i++) {
                System.arraycopy(new_acceleration[i], 1, acceleration[i], 0, acceleration[i].length);
            }


            Boolean[] is_moving = new Boolean[timestamp.size()];
            for (int index = 0; index < timestamp.size(); index++) {
                double acceleration_magnitude = Math.sqrt(Math.pow(acceleration[index][0], 2)
                        + Math.pow(acceleration[index][1], 2) + Math.pow(acceleration[index][2], 2));


                switch (Threshold) {
                    case 3:
                        THRESHOLD = 1.2;  // m/s
                        break;
                    case 6:
                        THRESHOLD = 2.5; // m/s
                        break;
                    case 9:
                        THRESHOLD = 3;// m/s
                        break;
                    case 12:
                        THRESHOLD = 3.5; // m/s
                        break;
                    default:
                        // Handle cases where selectedCode doesn't match any thresholds
                        break;
                }

                is_moving[index] = acceleration_magnitude > THRESHOLD; // threshold = 3 m/s/s


            }

            int margin = (int) (0.1 * sample_rate); // 100 ms
            for (int index1 = 0; index1 < timestamp.size() - margin; index1++) {
                Boolean moving = false;
                for (int i = index1; i < index1 + margin; i++) {
                    moving = moving || is_moving[i]; // check if any value in the window is true
                }
                is_moving[index1] = moving; // leading margin

            }

            for (int index2 = timestamp.size() - 1; index2 > margin; index2--) {
                boolean anyMoving = false;
                for (int i = index2 - margin; i < index2; i++) {
                    if (is_moving[i]) {
                        anyMoving = true;
                        break;
                    }
                }
                is_moving[index2] = anyMoving;
            }


            for (int index = 1; index < timestamp.size(); index++) {
                if (is_moving[index]) {
                    for (int axis = 0; axis < 3; axis++) {
                        velocity[index][axis] = velocity[index - 1][axis]
                                + delta_time.get(index) * acceleration[index][axis];
                    }
                }
            }


            double[] is_moving1 = new double[timestamp.size()];
            for (int index = 0; index < is_moving.length; index++) {
                if (!is_moving[index]) {
                    is_moving1[index] = 0;
                } else {
                    is_moving1[index] = 1;
                }
            }

            // Find start and stop indices of each moving period
            double[] is_moving_diff = new double[timestamp.size()];
            for (int index = 0; index < timestamp.size() - 1; index++) {
                is_moving_diff[index] = is_moving1[index + 1] - is_moving1[index];

            }
            for (int i = 0; i < is_moving_diff.length; i++) {

            }
            class IsMovingPeriod {
                public int start_index = -1;
                public int stop_index = -1;
            }

            List<IsMovingPeriod> is_moving_periods = new ArrayList<>();
            IsMovingPeriod is_moving_period = new IsMovingPeriod();

            for (int index = 0; index < timestamp.size(); index++) {
                if (is_moving_period.start_index == -1) {
                    if (is_moving_diff[index] == 1) {
                        is_moving_period.start_index = index;

                    }
                } else if (is_moving_period.stop_index == -1) {
                    if (is_moving_diff[index] == -1) {
                        is_moving_period.stop_index = index;
                        is_moving_periods.add(is_moving_period);
                        is_moving_period = new IsMovingPeriod();

                    }
                }
            }

            ArrayList<Double> timestamp1 = new ArrayList<Double>();
            for (int i = 0; i < timestamp.size(); i++) {
                double value = Double.parseDouble(timestamp.get(i));
                timestamp1.add(value);
            }

            double[][] velocity_drift = new double[timestamp.size()][3];

            for (IsMovingPeriod is_moving_period1 : is_moving_periods) {
                int start_index = is_moving_period1.start_index;
                int stop_index = is_moving_period1.stop_index;

                double[] t = {Double.parseDouble(timestamp.get(start_index)),
                        Double.parseDouble(timestamp.get(stop_index))};

                double[] x = {velocity[start_index][0], velocity[stop_index][0]};
                double[] y = {velocity[start_index][1], velocity[stop_index][1]};
                double[] z = {velocity[start_index][2], velocity[stop_index][2]};
                List<Double> t_new = timestamp1.subList(start_index, stop_index + 1);

                UnivariateInterpolator interpolator = new LinearInterpolator();
                velocity_drift[start_index][0] = interpolator.interpolate(t, x).value(t_new.get(0));
                velocity_drift[start_index][1] = interpolator.interpolate(t, y).value(t_new.get(0));
                velocity_drift[start_index][2] = interpolator.interpolate(t, z).value(t_new.get(0));

                for (int i = 1; i < t_new.size(); i++) {
                    velocity_drift[start_index + i][0] = interpolator.interpolate(t, x).value(t_new.get(i));
                    velocity_drift[start_index + i][1] = interpolator.interpolate(t, y).value(t_new.get(i));
                    velocity_drift[start_index + i][2] = interpolator.interpolate(t, z).value(t_new.get(i));
                }
            }


            for (int i = 0; i < velocity.length; i++) {
                velocity[i][0] -= velocity_drift[i][0];
                velocity[i][1] -= velocity_drift[i][1];
                velocity[i][2] -= velocity_drift[i][2];

                if (i > idx1) {
                    velocity[i][0] = 0;
                    velocity[i][1] = 0;
                    velocity[i][2] = 0;
                }
            }

            int sr = 20;

            // Calculate position
            double[][] position = new double[timestamp.size() - sr][3];
            velocity = Arrays.copyOfRange(velocity, sr, velocity.length);
            euler_time = Arrays.copyOfRange(euler_time, sr, euler_time.length);
            acceleration = Arrays.copyOfRange(acceleration, sr, acceleration.length);

            double centripetal_velocity = 0.0f;

            for (int i = 0; i < velocity.length; i++) {
                centripetal_velocity = Math.pow(velocity[i][2], 2.0f) / 0.8;
                velocity[i][2] = velocity[i][2] - centripetal_velocity;
            }


            timestamp.subList(0, sr).clear();
            delta_time.subList(0, sr).clear();


            for (int index = 1; index < timestamp.size(); index++) {
                double[] previousPosition = position[index - 1];
                double deltaTime = delta_time.get(index);
                double[] currentVelocity = velocity[index];
                for (int i = 0; i < 3; i++) {
                    position[index][i] = previousPosition[i] + deltaTime * currentVelocity[i];

                }
            }

            double[][] new_position = new double[position.length][4];
            for (int i = 0; i < position.length; i++) {

                new_position[i][0] = Double.parseDouble(timestamp.get(i));
                System.arraycopy(position[i], 0, new_position[i], 1, 3);
            }


            Map ReturnValues = front_back_split(new_position, velocity, euler_time, acceleration, ScoreData);


            centre_front = ReturnValues.get("centre_front");
            backstroke = ReturnValues.get("front_stroke");
            front_stroke = ReturnValues.get("backstroke");
            ratio_back_front = ReturnValues.get("ratio_back_front");
            elevation_impact = ReturnValues.get("elevation_impact");
            velocity_abs = ReturnValues.get("velocity_abs");
            sharedInt = (int) ReturnValues.get("splitIndex");
            diff_yaw = ReturnValues.get("diff_yaw");
            roll_start = ReturnValues.get("roll_start");
            roll_impact = ReturnValues.get("roll_impact");
            pos_y_impact = ReturnValues.get("pos_y_impact");
            pitch_impact = ReturnValues.get("pitch_impact");
            diff_yaw = ReturnValues.get("diff_yaw");
            front_impact_time = ReturnValues.get("front_impact_time");
            backstroke_time = ReturnValues.get("backstroke_time");
            loft_angle = ReturnValues.get("loft_angle");
            accelerationImpact = ReturnValues.get("accelerationImpact");

            avgScore = ReturnValues.get("avgScore");

        } catch (Exception e) {
            Log.e("Exception: 395", String.valueOf(e));
        }

        multiValues.put("backstroke", backstroke);
        multiValues.put("front_stroke", front_stroke);
        multiValues.put("splitIndex", sharedInt);
        multiValues.put("ratio_back_front", ratio_back_front);
        multiValues.put("elevation_impact", elevation_impact);
        multiValues.put("centre_front", centre_front);
        multiValues.put("velocity_abs", velocity_abs);
        multiValues.put("diff_yaw", diff_yaw);
        multiValues.put("roll_start", roll_start);
        multiValues.put("roll_impact", roll_impact);
        multiValues.put("pos_y_impact", pos_y_impact);
        multiValues.put("pitch_impact", pitch_impact);
        multiValues.put("diff_yaw", diff_yaw);
        multiValues.put("front_impact_time", front_impact_time);
        multiValues.put("backstroke_time", backstroke_time);
        multiValues.put("loft_angle", loft_angle);
        multiValues.put("accelerationImpact", accelerationImpact);
        multiValues.put("avgScore", avgScore);

        return multiValues;

    }

    public static Map front_back_split(double[][] pos, double[][] velocity, double[][] euler_time, double[][] acceleration, String[] ScoreData) {

        Map<String, Object> multiValuesReturn = new HashMap<String, Object>();
        int column_index = 1;
        List<Integer> zero_rows = new ArrayList<>();
        for (int i = 0; i < pos.length; i++) {
            if (pos[i][column_index] == 0) {
                zero_rows.add(i);
            }
        }
        double[][] pos_time = new double[pos.length - zero_rows.size()][pos[0].length];
        int pos_time_index = 0;
        for (int i = 0; i < pos.length; i++) {
            if (!zero_rows.contains(i)) {
                pos_time[pos_time_index] = pos[i];
                pos_time_index++;
            }
        }

        boolean[] mask = new boolean[pos_time.length];
        mask[0] = false;
        for (int i = 1; i < pos_time.length; i++) {
            mask[i] = !Arrays.equals(pos_time[i], pos_time[i - 1]);
        }
        for (int i = 0; i < pos_time.length; i++) {
            if (!mask[i]) {

                Arrays.fill(pos_time[i], 0);
            }
        }
        int numNonZeroRows = 0;
        for (int i = 0; i < pos_time.length; i++) {
            boolean isZeroRow = true;
            for (int j = 0; j < pos_time[0].length; j++) {
                if (pos_time[i][j] != 0.0) {
                    isZeroRow = false;
                    break;
                }
            }
            if (!isZeroRow) {
                if (i != numNonZeroRows) {
                    // Move the non-zero row to its new position
                    pos_time[numNonZeroRows] = pos_time[i];
                }
                numNonZeroRows++;
            }
        }

        // Update the length of the array
        pos_time = Arrays.copyOf(pos_time, numNonZeroRows);

        double[] pos_time_x = new double[pos_time.length];

        for (int m = 0; m < pos_time.length; m++) {
            pos_time_x[m] = pos_time[m][1];
        }

        double lowest_neg = Double.POSITIVE_INFINITY;
        int cutoff_idx = -1;
        for (int i = 0; i < pos_time_x.length; i++) {
            if (pos_time_x[i] < 0 && pos_time_x[i] < lowest_neg) {
                lowest_neg = pos_time_x[i];
                cutoff_idx = i;
            }
        }
        //need to code from here....
        double[][] backstroke = Arrays.copyOfRange(pos_time, 0, cutoff_idx);
        double[][] front_stroke = Arrays.copyOfRange(pos_time, cutoff_idx, pos_time.length);


        double[] frontStrokeX = new double[front_stroke.length];
        for (int i = 0; i < front_stroke.length; i++) {
            frontStrokeX[i] = front_stroke[i][1];
        }

        List<Double> arrayX = new ArrayList<>();
        for (int i = 0; i < frontStrokeX.length; i++) {
            double x = frontStrokeX[i];
            if (x > 0) {
                x = 0 + x;
            } else {
                x = 0 - x;
            }
            arrayX.add(x);
        }

        double[] arrayXArr = new double[arrayX.size()];
        for (int i = 0; i < arrayX.size(); i++) {
            arrayXArr[i] = arrayX.get(i);
        }

        int splitIndex = 0;
        for (int i = 0; i < arrayXArr.length; i++) {
            if (arrayXArr[i] < arrayXArr[splitIndex]) {
                splitIndex = i;
            }
        }

        double[][] arr1 = new double[splitIndex][pos_time[0].length];
        double[][] centre_front = new double[pos_time.length - splitIndex][pos_time[0].length];
        for (int i = 0; i < pos_time.length; i++) {
            if (i < splitIndex) {
                arr1[i] = pos_time[i];
            } else {
                centre_front[i - splitIndex] = pos_time[i];
            }
        }


        System.out.println("Testtrtrt" + Arrays.toString(centre_front));
        double backstroke_time = backstroke[backstroke.length - 1][0] - backstroke[1][0];
        double front_impact_time = centre_front[centre_front.length - 1][0] - backstroke[backstroke.length - 2][0];

        // Find the greatest common divisor
        double num1 = front_impact_time / backstroke_time;
        // Express the ratio as a fraction with denominator 1
        String ratio_back_front = String.format("%.2f", num1);


        double elevation_impact = centre_front[0][3] * 100;
        double pos_y_impact = pos_time[0][2] - centre_front[0][2];
        double loft_angle = (1.1 - elevation_impact / 2.1);
        double[] velocity_abs = new double[velocity.length];

        for (int i = 0; i < velocity.length; i++) {
            velocity_abs[i] = Math.sqrt(Math.pow(velocity[i][0], 2) + Math.pow(velocity[i][1], 2) + Math.pow(velocity[i][2], 2));
        }


        double start_time = pos_time[0][0];
        int index_start = -1;
        for (int i = 0; i < euler_time.length; i++) {
            if (euler_time[i][0] == start_time) {
                index_start = i;
                break;
            }
        }
        double yaw_start = 0.0;
        double roll_start = 0.0;
        if (index_start != -1) {
            roll_start = euler_time[index_start][1];
            roll_start = roll_start + 90;
            yaw_start = euler_time[index_start][3];
        }


        double impact_time = centre_front[0][0];
        int index_impact = -1;
        double roll_impact = 0.0;
        for (int i = 0; i < euler_time.length; i++) {
            if (euler_time[i][0] == impact_time) {
                index_impact = i;
                break;
            }
        }
        if (index_impact != -1) {
            roll_impact = euler_time[index_impact][1];
            roll_impact = roll_impact + 90;
        }

        double diff_yaw = 0.0;
        if (index_impact != -1) {
            double yaw_impact = euler_time[index_impact][3];
            diff_yaw = yaw_start - yaw_impact;
            backstroke[0][1] = 0;
            backstroke[0][2] = 0;
            backstroke[0][3] = 0;
        }

        double pitch_impact = 0.0;
        if (index_impact != -1) {
            pitch_impact = euler_time[index_impact][2];

        }
//
//        double[][] backstrokeWithFrontStroke = new double[backstroke.length + 1][];
//        for (int i = 0; i < backstroke.length; i++) {
//            backstrokeWithFrontStroke[i] = backstroke[i];
//        }
//        backstrokeWithFrontStroke[backstroke.length] = front_stroke[0];
//        backstroke = backstrokeWithFrontStroke;

        for (int i = 0; i < backstroke.length; i++) {
            if (i == 0) {
                Log.e("backstroke: 0", backstroke[i][0] + "," + backstroke[i][1] + "," + backstroke[i][2]);
            } else if ((backstroke.length - 1) == i) {
                Log.e("backstroke: last", backstroke[i][0] + "," + backstroke[i][1] + "," + backstroke[i][2]);
            }
        }


        for (int i = 0; i < front_stroke.length; i++) {
            //for( int j =0; j < front_stroke.length; j++) {
            if ((front_stroke.length - 1) == i) {
                Log.e("front_stroke: " + i, front_stroke[i][0] + "," + front_stroke[i][1] + "," + front_stroke[i][2]);
            } else if (i == 0) {
                Log.e("front_stroke: " + i, front_stroke[i][0] + "," + front_stroke[i][1] + "," + front_stroke[i][2]);
            }
            // }
        }


        //Log.e( "back_centre: last", back_centre.toString());


        for (int i = 0; i < centre_front.length; i++) {
            //if((back_centre.length - 1) == i){
            if (i == 0) {
                Log.e("centre_front: ", centre_front[i][0] + "," + centre_front[i][1] + "," + centre_front[i][2]);
            }
        }


        double accelerationImpact = -acceleration[index_impact][0];
        double accelerationImpact1;
        double[] accel_x = new double[acceleration.length];
        for (int i = 0; i < acceleration.length; i++) {
            accel_x[i] = acceleration[i][0];
        }

        double max = accel_x[0];


        for (int i = 1; i < accel_x.length; i++) {
            if (accel_x[i] > max) {
                max = accel_x[i];
            }
        }
        accelerationImpact1 = max;
        double score[];
        double avg;

        score = new double[9];
        for (int i = 0; i < ScoreData.length; i++) {
            Double.parseDouble(ScoreData[1]);

        }
        score[0] = scoringFunction(1, num1, 0.5);
        score[1] = scoringFunction(0, elevation_impact, 0);
        score[2] = scoringFunction(Double.parseDouble(ScoreData[5]), loft_angle, Double.parseDouble(ScoreData[4]));
        score[3] = scoringFunction(0, pos_y_impact, 0);
        score[4] = scoringFunction(Double.parseDouble(ScoreData[1]), roll_start, Double.parseDouble(ScoreData[0]));
        score[5] = scoringFunction(Double.parseDouble(ScoreData[3]), roll_impact, Double.parseDouble(ScoreData[2]));
        score[6] = scoringFunction(0, diff_yaw, 2);
        score[7] = scoringFunction(Double.parseDouble(ScoreData[7]), accelerationImpact1, Double.parseDouble(ScoreData[6]));
        avg = ((score[0] + score[1] + score[2] + score[3] + score[4] + score[5] + score[6] + score[7]) / score.length);
        score[8] = (int) (avg);
        int avgScore = (int) avg;


//        score[0] = (10 - (Math.abs((0.5 - num1))));
//        score[1]= (10 -Math.abs(0 - elevation_impact));
//        score[2] = loft_angle;
//        score[3]= (10 - Math.abs(0 - pos_y_impact));
//        score[4]= (10 - Math.abs(70 - roll_start));
//        score[5]= (10 - Math.abs(70 - roll_impact));
//        score[6]= (10 - Math.abs(0 - diff_yaw));
//        avg= ((score[0]+score[1]+score[2]+score[3]+score[4]+score[5]+score[6])/score.length)*10;
//
//        score[7]= (int)(avg);
//        int avgScore= (int) avg;


        Log.e("accelerationImpact ", String.valueOf(accelerationImpact1));
        Log.e("score ", String.valueOf(score));
        Log.e("avg_score ", String.valueOf(avgScore));

        Log.e("centre_front ", Arrays.deepToString(centre_front));
        Log.e("backstroke ", Arrays.deepToString(backstroke));
        Log.e("front_stroke ", Arrays.deepToString(front_stroke));
        Log.e("ratio_back_front ", ratio_back_front);
        Log.e("elevation_impact ", String.valueOf(elevation_impact));
        Log.e("velocity_abs ", Arrays.toString(velocity_abs));
        Log.e("splitIndex: ", String.valueOf(splitIndex));
        Log.e("diff_yaw: ", String.valueOf(diff_yaw));
        Log.e("roll_start: ", String.valueOf(roll_start));
        Log.e("roll_impact: ", String.valueOf(roll_impact));
        Log.e("pos_y_impact: ", String.valueOf(pos_y_impact));
        Log.e("pitch_impact: ", String.valueOf(pitch_impact));
        Log.e("Loft angle: ", String.valueOf(loft_angle));
        Log.e("front_impact_time: ", String.valueOf(front_impact_time));
        Log.e("backstroke_time : ", String.valueOf(backstroke_time));


        //multiValuesReturn.put("back_centre", back_centre);


        multiValuesReturn.put("centre_front", centre_front);
        multiValuesReturn.put("backstroke", backstroke);
        multiValuesReturn.put("front_stroke", front_stroke);
        multiValuesReturn.put("ratio_back_front", ratio_back_front);
        multiValuesReturn.put("elevation_impact", elevation_impact);
        multiValuesReturn.put("front_impact_time", front_impact_time);
        multiValuesReturn.put("backstroke_time", backstroke_time);
        multiValuesReturn.put("velocity_abs", velocity_abs);
        multiValuesReturn.put("splitIndex", splitIndex);
        multiValuesReturn.put("roll_start", roll_start);
        multiValuesReturn.put("roll_impact", roll_impact);
        multiValuesReturn.put("pos_y_impact", pos_y_impact);
        multiValuesReturn.put("pitch_impact", pitch_impact);
        multiValuesReturn.put("diff_yaw", diff_yaw);
        multiValuesReturn.put("loft_angle", loft_angle);
        multiValuesReturn.put("accelerationImpact", accelerationImpact);
        multiValuesReturn.put("avgScore", avgScore);

        return multiValuesReturn;
    }

    private static double scoringFunction(double target, double value, double deviation) {
        double m1 = Math.abs(target - value);
        if (m1 <= deviation) {
            return 10.0;
        } else {
            if (target < value) {
                return (1.0 / (Math.abs((target + deviation) - value) + 1.0)) * 10.0;
            } else {
                return (1.0 / (Math.abs((target - deviation) - value) + 1.0)) * 10.0;
            }
        }
    }

}
