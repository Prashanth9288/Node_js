const User = require('../models/User');
exports.createUser = async (req, res) => {
  try {
    const { name, email, age, addresses } = req.body;
    const user = new User({ name, email, age, addresses });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};
exports.addAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const address = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.addresses.push(address);
    await user.save();
    const added = user.addresses[user.addresses.length - 1];
    res.status(201).json({ message: 'Address added', address: added });
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
};
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getSummary = async (req, res) => {
  try {
    const result = await User.aggregate([
      {
        $project: {
          name: 1,
          addressCount: { $size: { $ifNull: ['$addresses', []] } }
        }
      },
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalUsers: { $sum: 1 },
                totalAddresses: { $sum: '$addressCount' }
              }
            }
          ],
          users: [
            {
              $project: { _id: 1, name: 1, addressCount: 1 }
            }
          ]
        }
      }
    ]);
    const totals = (result[0] && result[0].totals[0]) || { totalUsers: 0, totalAddresses: 0 };
    const users = (result[0] && result[0].users) || [];
    res.json({
      totalUsers: totals.totalUsers,
      totalAddresses: totals.totalAddresses,
      users: users.map(u => ({ id: u._id, name: u.name, addressCount: u.addressCount }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ message: 'Address not found' });
    address.remove();
    await user.save();
    res.json({ message: 'Address deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
