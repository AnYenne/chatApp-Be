const Conversation = require('../models/conversation.model')
const Friend = require('../models/friend.model')

const pair = (a,b) => (a > b) ? [a, b] : [b, a];

export const checkFriendShip = async (req, res) => {
    try {
        const {recipientId} = req.body?.recipientId ?? null;
        const me = req.user._id.toString();
        const memberIds = req.body?.memberIds ?? [];
        if(!recipientId && memberIds.length == 0){
            return res.status(400).json({message: 'need to provide reciptientId or memberIds'})
        }

        if(recipientId){
            const [userA, userB] = pair(me, recipientId)
            const friend = await Friend.findOne({userA, userB});

            if(!friend){
                return res.status(403).json({message: 'you are not friend with them'})
            }
            return next();
        }
        const friendChecks =  memberIds.map( async (memberId) => {
            const [userA, userB] = pair(me, memberId);
            const friend =  await Friend.findOne({userA, userB});
            return friend ? null : memberId
        })
        const results =  await Promise.all(friendChecks);
        const notFriends =  results.filter(Boolean);

        if(notFriends.length > 0){
            return res.status(403).json({message: 'you just can only add friend to group', notFriends})
        }
        next()

    } catch (error) {
        console.error(error, "check friendship error")
        res.status(500).json({message: 'server eror'})
    }

}

export const checkGroupMembership = async(req, res, next) => {
  try {
    const { conversationId } = req.body;
    const userId = req.user._id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Không tìm thấy cuộc trò chuyện" });
    }

    const isMember = conversation.participants.some(
      (p) => p.userId.toString() === userId.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: "Bạn không ở trong group này." });
    }

    req.conversation = conversation;

    next();
  } catch (error) {
    console.error("Lỗi checkGroupMembership:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }

}
