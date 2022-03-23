export declare class AmmoInstance {
    btDefaultCollisionConfiguration: new () => btDefaultCollisionConfiguration;

    btCollisionDispatcher: new (config: btDefaultCollisionConfiguration) => btCollisionDispatcher;

    btDbvtBroadphase: new () => btDbvtBroadphase;

    btSequentialImpulseConstraintSolver: new () => btSequentialImpulseConstraintSolver;

    btDiscreteDynamicsWorld: new (dispatcher: btCollisionDispatcher, overlappingPairCache: btDbvtBroadphase, solver: btSequentialImpulseConstraintSolver, config: btDefaultCollisionConfiguration) => btDiscreteDynamicsWorld;

    btVector3: new (x: number, y: number, z: number) => btVector3;

    btQuaternion: new () => btQuaternion;

    btTransform: new () => btTransform;

    btBoxShape: new (boxHalfExtents: btVector3) => btBoxShape;
    btCompoundShape: new () => btCompoundShape;
    btSphereShape: new (radius: number) => btSphereShape;
    btConvexHullShape: new (points?: number[], numPoints?: number) => btConvexHullShape;

    btDefaultMotionState: new (transform: btTransform) => btDefaultMotionState;

    btRigidBodyConstructionInfo: new (mass: number, motionState: btMotionState, collisionShape: btCollisionShape, localInertia?: btVector3) => btRigidBodyConstructionInfo;

    btRigidBody: new (rbinfo: btRigidBodyConstructionInfo) => btRigidBody;


}

// export declare namespace AmmoInstsance {
//     export declare class btDefaultCollisionConfiguration {
//         constructor();
//     }
// }

export declare class btDefaultCollisionConfiguration {

}

export declare class btDbvtBroadphase {

}

export declare class btCollisionDispatcher {

}

export declare class btSequentialImpulseConstraintSolver {

}

export declare class btDiscreteDynamicsWorld {
    setGravity(gravity: btVector3): void;

    addRigidBody(body: btRigidBody): void;
    addRigidBody(body: btRigidBody, group: number, mask: number): void;
    removeRigidBody(body: btRigidBody): void;

    stepSimulation(timeStep: number, maxSubSteps?: number, fixedTimeStep?: number): number;
}

export declare class btVector3 {
    constructor();
    constructor(x: number, y: number, z: number);
    length(): number;
    x(): number;
    y(): number;
    z(): number;
    setX(x: number): void;
    setY(y: number): void;
    setZ(z: number): void;
    setValue(x: number, y: number, z: number): void;
    normalize(): void;
    dot(v: btVector3): number;
    rotate(wAxis: btVector3, angle: number): btVector3;
}

export declare class btQuaternion {
    constructor(x: number, y: number, z: number, w: number);
    setEulerZYX(z: number, y: number, x: number): void;
}

export declare class btTransform {
    constructor();

    setIdentity(): void;
    setOrigin(origin: btVector3): void;
    setRotation(rotation: btQuaternion): void;
    getOrigin(): btVector3;
    getRotation(): btQuaternion;
}

export declare class btBoxShape implements btCollisionShape {
    calculateLocalInertia(mass: number, inertia: btVector3): void;
}

export declare interface btCollisionShape {
    calculateLocalInertia(mass: number, inertia: btVector3): void;
}

export declare class btDefaultMotionState implements btMotionState {
    getWorldTransform(worldTrans: btTransform): void;
    setWorldTransform(worldTrans: btTransform): void;
}

export declare interface btMotionState {
    getWorldTransform(worldTrans: btTransform): void;
    setWorldTransform(worldTrans: btTransform): void;
}

export declare class btRigidBodyConstructionInfo {

}

export declare interface btCollisionObject {

}

export declare class btRigidBody implements btCollisionObject {
    setAngularFactor(angularFactor: btVector3): void;

    getMotionState(): btMotionState;
    setMotionState(motionState: btMotionState): void;

    getLinearVelocity(): btVector3;
    setLinearVelocity(lin_vel: btVector3): void;
}

export declare class btCompoundShape implements btCollisionShape {
    calculateLocalInertia(mass: number, inertia: btVector3): void;
    addChildShape(localTransform: btTransform, shape: btCollisionShape): void;
    removeChildShape(shape: btCollisionShape): void;
    removeChildShapeByIndex(childShapeIndex: number): void;
    getChildShape(index: number): btCollisionShape;
    updateChildTransform(childIndex: number, newChildTransform: btTransform, shouldRecalculateLocalAabb?: boolean): void;
}

export declare class btSphereShape implements btCollisionShape {
    calculateLocalInertia(mass: number, inertia: btVector3): void;
}

export declare class btConvexHullShape implements btCollisionShape {
    calculateLocalInertia(mass: number, inertia: btVector3): void;
    addPoint(point: btVector3, recalculateLocalAABB?: boolean): void;
    getNumVertices(): number;
}