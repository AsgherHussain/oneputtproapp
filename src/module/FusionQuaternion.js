

export class FusionQuaternion {
  constructor(w, x, y, z) {
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
  }

  FusionQuaternionAdd(quaternionA, quaternionB) {
    const result = new FusionQuaternion(
      quaternionA.w + quaternionB.w,
      quaternionA.x + quaternionB.x,
      quaternionA.y + quaternionB.y,
      quaternionA.z + quaternionB.z,
    );
    return result;
  }

  FusionQuaternionMultiplyVector(quaternion, vector) {
    const q = quaternion;
    const v = vector;
    const result = new FusionQuaternion(
      -q.x * v.x - q.y * v.y - q.z * v.z,
      q.w * v.x + q.y * v.z - q.z * v.y,
      q.w * v.y - q.x * v.z + q.z * v.x,
      q.w * v.z + q.x * v.y - q.y * v.x,
    );
    return result;
  }

  FusionQuaternionMultiply(quaternionA, quaternionB) {
    const result = new FusionQuaternion(
      quaternionA.w * quaternionB.w -
        quaternionA.x * quaternionB.x -
        quaternionA.y * quaternionB.y -
        quaternionA.z * quaternionB.z,
      quaternionA.w * quaternionB.x +
        quaternionA.x * quaternionB.w +
        quaternionA.y * quaternionB.z -
        quaternionA.z * quaternionB.y,
      quaternionA.w * quaternionB.y -
        quaternionA.x * quaternionB.z +
        quaternionA.y * quaternionB.w +
        quaternionA.z * quaternionB.x,
      quaternionA.w * quaternionB.z +
        quaternionA.x * quaternionB.y -
        quaternionA.y * quaternionB.x +
        quaternionA.z * quaternionB.w,
    );
    return result;
  }
}


