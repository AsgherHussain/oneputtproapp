import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

//pdf
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';

// style and color css
import colors from '../../styles/colors';
import style from './style';

const PuttingMatrix = () => {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>One Putt Pro Putting Metrics</Text>
        <Text style={styles.paragraph}>
          Becoming a great putter comes down to learning the ins and outs of
          your unique stroke. Unlike the full swing, there is no “one way” to
          make putts. Think about it… Tiger Woods is a very different type of
          putter compared to Jack Nicklaus or Brad Faxon, but each are some of
          the best putters in the game. One Putt Pro makes it easier than ever
          to analyze your putting stroke to make better contact and drain more
          putts.
        </Text>

        <Text style={styles.matricsmeasured}>
          Here are the metrics measured inside the app:
        </Text>
        <Text style={styles.header}>
          Putter Path (Backstroke and Forward Stroke)
        </Text>
        <Text style={styles.paragraph}>
          The final metric from One Putt Pro is the putter path, which refers to
          the direction the putter travels during the stroke. This makes it easy
          to see how the putter is moving on the backstroke and forward stroke
          as it will affect direction and speed. There isn’t a set “target” with
          this metric as it changes based on the length of the putt and type of
          putter used. For example, some golfers prefer a more straight back,
          straight through motion while others prefer a more inside to outside
          path. One Putt Pro makes it easy to determine if you’re taking the
          putter too far back on the inside, straight back, or on an outside
          path. Now you will never have to guess your putter path and will have
          data to help you perfect your stroke. By measuring and analyzing these
          putting metrics, One Putt Pro provides golfers with valuable insights
          into their putting stroke. With real-time feedback golfers can improve
          their putting performance and take their game to the next level.
        </Text>
        <Text style={styles.header}>
          Putting Tempo (Back to Front Stroke Ratio)
        </Text>
        <View style={styles.content}>
          <Image
            style={styles.imgangle}
            source={require('../../../assets/Images/MicrosoftTeams-image(5).png')}
          />
        </View>

        <Text style={styles.paragraph}>
          Tempo is one of the most important fundamentals in both putting and
          the full swing in golf. With putting, the correct tempo will help
          improve speed control and hit more solid putts. We define tempo as the
          total amount of time that your backstroke takes vs. your forward
          stroke timing. Putting (and all short game shots) require a 2:1 tempo
          - which means your back stroke takes twice as long as your forward
          stroke. A 2:1 putting tempo ensures that you have a good “pop” in your
          stroke and accelerate through the ball at impact. Otherwise, you risk
          deceleration which leads to a lot of mishits and putts that come up
          short of the hole. To master your speed control, especially with lag
          putting, you want a consistent rhythm throughout the stroke. One Putt
          Pro makes it easy to measure your backstroke time, forward stroke
          time, and tempo ratio for more consistent putting. This way you can
          easily identify if one aspect of your stroke has incorrect timing.
        </Text>
        <Text style={styles.header}>Loft Angle</Text>
        <Text style={styles.paragraph}>
          Loft angle is the elevation of the putter at impact position and
          affects the spin of the ball once it leaves the face of the club. In
          general, 3–4 degrees is considered an effective loft at impact. The
          goal is to keep the putter the same loft throughout the stroke;
          otherwise changing the loft can negatively impact the roll. For
          example, if you deloft the putter you will hit more down on the ball,
          which will cause it to pop up in the air after impact.
        </Text>
        <View style={styles.content}>
          <Image
            style={styles.imgangle}
            source={require('../../../assets/Images/MicrosoftTeams-image(10).png')}
          />
        </View>
        <Text style={styles.paragraph}>
          This will cause the ball to bounce instead of roll straight and make
          it more likely to get the ball off-line and/or end up short of the
          hole. If the loft angle is more at impact, you have added loft during
          your stroke (usually from a cupping motion). This motion increases
          loft and gets the ball more in the air and will also negatively affect
          speed control. Once you can maintain the same loft (within .5 degrees)
          you’ll see a huge improvement in your putting performance.
        </Text>
        <Text style={styles.header}>Putter Face Angle</Text>
        <Text style={styles.paragraph}>
          The direction of the putt is largely determined by the face angle at
          impact and every degree counts. Inside the app this metric is either
          positive (open face) or negative (closed face). When the putter is
          open there isn’t enough rotation on the forward stroke. When the
          putter is closed at impact it means that the putter face rotated too
          much in the forward stroke. If your putter is open at impact you are
          more likely to miss a lot of putts right. If your putter is closed at
          impact you’re more likely to miss a lot of putts left. The more
          consistent you can get your putter face at impact, the more likely you
          are to get the putt started on the right line. Paired with the right
          speed, you will make a lot more putts and this app makes it easy to
          understand your tendencies.
          </Text>
          <View style={styles.content}>
            <Image
              style={styles.imgangle}
              source={require('../../../assets/Images/MicrosoftTeams-image(6).png')}
            />
            <Image
              style={styles.imgangle}
              source={require('../../../assets/Images/MicrosoftTeams-image(7).png')}
            />
            <Image
              style={styles.imgangle}
              source={require('../../../assets/Images/MicrosoftTeams-image.png')}
            />
          </View>
        <Text style={styles.header}>Putter Face Position</Text>
        <Text style={styles.paragraph}>
          Another useful metric from One Putt Pro is the impact position; this
          device makes it easy to see if you hit the putt in center, off the
          toe, or off the heel. The goal is to get it as close to the center as
          possible to hit the sweet spot and get the putt rolling straight. A
          heel or toe strike can lead to a fade or draw spin which will
          negatively impact distance and accuracy. The app will instantly
          determine where you hit the putt on the face and how it’s impacting
          speed or direction. A lot of players hit more towards the toe or heel
          without knowing it which can lead to tons of issues with speed and
          accuracy. This metric makes it easy to determine if this is a setup or
          stroke issue so you can resolve it quickly and find the sweet spot
          more often.
        </Text>
        <View style={styles.content}>
          <Image
            style={styles.imgangle}
            source={require('../../../assets/Images/MicrosoftTeams-image(9).png')}
          />
          <Image
            style={styles.imgangle}
            source={require('../../../assets/Images/MicrosoftTeams-image(1).png')}
          />
        </View>
        <Text style={styles.header}>Lie Angle Change</Text>
        <Text style={styles.paragraph}>
          Lie angle is another important metric with putting and refers to the
          angle in which the shaft intersects the head relative to the ground.
          The goal is to maintain the same lie angle throughout the stroke for a
          consistent strike. Maintaining the same lie angle helps improve the
          path for a more consistent stroke.
        </Text>
        <View style={styles.content}>
          <Image
            style={styles.imgangle}
            source={require('../../../assets/Images/MicrosoftTeams-image(8).png')}
          />
          <Image
            style={styles.imgangle}
            source={require('../../../assets/Images/MicrosoftTeams-image.png')}
          />
        </View>
        <Text style={styles.paragraph}>
          The correct lie angle will give you the best chance to stroke the putt
          near the sweet spot for a smooth roll. If your lie angle changes
          during the stroke it’s easier to hit the putt off the toe, heel, or
          too low on the face. This causes poor contact and will negatively
          affect the speed of the putt. When you lift your hands higher, you
          increase the lie angle which makes the heel come off the ground. When
          you drop your hands lower, you decrease lie angle which makes the toe
          come off the ground. Performance studies have found that it’s best for
          the putter toe and heel to sit evenly at address position. Lie angle
          is measured in degrees and will have a huge impact on the quality of
          your putt.
        </Text>
        <Text style={styles.header}>Acceleration at Impact</Text>
        <View style={styles.content}>
          <Image
            style={styles.imgangle}
            source={require('../../../assets/Images/MicrosoftTeams-image(11).png')}
          />
        </View>
        <Text style={styles.paragraph}>
          You can only accelerate once during a golf swing or putting stroke and
          it better happen at impact. Acceleration at impact refers to the speed
          of the putter head at impact as it affects the roll and distance of
          the putt.Great putters accelerate through the putt, not on the
          backstroke or too early in the stroke. While most everyday golfers
          tend to take the putter back too quickly which leads to deceleration.
          One Putt Pro makes it easy to determine your acceleration at impact
          for proper speed control.
        </Text>
      </View>
    </ScrollView>
    
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:20,
    paddingVertical:30,
  },
  header: {
    marginTop: 10,
    color: '#991e21',
    fontSize: '16@ms',
    fontWeight: 'bold',
  },
  paragraph: {
    paddingTop: 10, // Padding only to the top
    paddingBottom: 15, // Padding only to the bottom
    textAlign: 'left',
    fontSize: '14@ms',
    lineHeight: '24@ms',
    color: '#6B6D6E',
  },
  matricsmeasured: {
    marginTop: 2,
    fontSize: '16@ms',
    lineHeight: '24@ms',
    color: '#6B6D6E',
    fontWeight: 'bold',
  },
  imgangle: {
    width: '100@ms',
    height: '120@mvs',
    resizeMode: 'contain',
  },
  content:{
    flexDirection:'row',
    justifyContent:'center'
  }
});

export default PuttingMatrix;
