const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.editPost = functions.https.onCall(async (data, context) => {
    const { postId, newContent } = data;
    const uid = context.auth.uid;

    if (!uid) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const postRef = admin.firestore().collection('posts').doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Post not found');
    }

    const postData = postDoc.data();

    if (postData.author._id !== uid) {
        throw new functions.https.HttpsError('permission-denied', 'User is not authorized to edit this post');
    }

    await postRef.update({ content: newContent });
    return { success: true };
});

exports.deletePost = functions.https.onCall(async (data, context) => {
    const { postId } = data;
    const uid = context.auth.uid;

    if (!uid) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const postRef = admin.firestore().collection('posts').doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Post not found');
    }

    const postData = postDoc.data();

    if (postData.author._id !== uid) {
        throw new functions.https.HttpsError('permission-denied', 'User is not authorized to delete this post');
    }

    await postRef.delete();
    return { success: true };
});