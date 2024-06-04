export class FusionVector {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static FusionVectorCrossProduct(vectorA, vectorB) {
    const result = new FusionVector(
      (vectorA.y * vectorB.z) - (vectorA.z * vectorB.y),
      (vectorA.z * vectorB.x) - (vectorA.x * vectorB.z),
      (vectorA.x * vectorB.y) - (vectorA.y * vectorB.x)
    );
    return result;
  }

  static FusionVectorAdd(vectorA, vectorB) {
    const result = new FusionVector(
      vectorA.x + vectorB.x,
      vectorA.y + vectorB.y,
      vectorA.z + vectorB.z
    );
    return result;
  }

  FusionVectorMultiplyScalar(scalar) {
    const result = new FusionVector(
      this.x * scalar,
      this.y * scalar,
      this.z * scalar
    );
    return result;
  }

  static FusionVectorHadamardProduct(vectorA, vectorB) {
    const result = new FusionVector(
      vectorA.x * vectorB.x,
      vectorA.y * vectorB.y,
      vectorA.z * vectorB.z
    );
    return result;
  }

  static FusionVectorMagnitudeSquared(vector) {
    const hadamardProduct = FusionVector.FusionVectorHadamardProduct(vector, vector);
    return FusionVector.FusionVectorSum(hadamardProduct);
  }

  static FusionVectorSum(vector) {
    return vector.x + vector.y + vector.z;
  }

  static FusionFastInverseSqrt(d) {
    let i = Float32Array.from([d]).buffer;
    i = 0x5F1F1412 - (i >> 1);
    const f = new Float32Array([i])[0];

    return f * (1.69000231 - 0.714158168 * d * f * f);
  }

  static FusionVectorNormalise(vector) {
    const magnitudeReciprocal = FusionVector.FusionFastInverseSqrt(FusionVector.FusionVectorMagnitudeSquared(vector));
    vector = vector.FusionVectorMultiplyScalar(magnitudeReciprocal);
    return vector;
  }
}
