import Helpers from '../helpers/helpers';
import Group from '../models/groups';
import JoinedGroup from '../models/joinedGroups';
import moment from 'moment';

const group = new Group();
const joinedG = new JoinedGroup();
const date = moment(new Date()).format('YYYY-MM-DD');

class GroupController {
  static async createGroup(req, res) {
    const currentuser = await Helpers.getLoggedInUser(req, res);
    const newGroup = {
      ...req.body,
      owner_id: currentuser.id,
    };
    const _group = await group.create(newGroup);
    if (_group.errors) {
      return Helpers.dbError(res, _group);
    }
    const date = moment(new Date()).format('YYYY-MM-DD');
    const newJoin = {
      user_id: currentuser.id,
      group_id: _group.rows[0].id,
      join_date: date,
      status: 'accepted',
    };
    const _join = await joinedG.create(newJoin);
    if (_join.errors) {
      return Helpers.dbError(res, _join);
    }
    return Helpers.sendResponse(res, 200, 'Group created successfully', { group: _group.rows[0] });
  }

  static async joinGroup(req, res) {
    const currentuser = await Helpers.getLoggedInUser();

    const _group = await group.getById(req.params.id);
    if (_group.errors) {
      return Helpers.dbError(res, _group);
    }
    let newJoin = {};
    if (_group.row.type === 'private') {
      newJoin = {
        user_id: currentuser.id,
        group_id: req.params.id,
        join_date: date,
        status: 'pending',
      };
    } else {
      newJoin = {
        user_id: currentuser.id,
        group_id: req.params.id,
        join_date: date,
        status: 'accepted',
      };
    }

    const _newjoin = await joinedG.create(newJoin);
    if (_newjoin.errors) {
      return Helpers.dbError(res, _newjoin);
    }
    return Helpers.sendResponse(res, 200, 'Group joined successfully', {
      group: _newjoin.rows,
    });
  }

  static async deleteGroup(req, res) {
    const _group = await group.delete({ id: req.params.id });
    if (_group.errors) {
      return Helpers.dbError(res, _group);
    }
    return Helpers.sendResponse(res, 200, 'Group deleted successfully');
  }

  static async updateGroup(req, res) {
    const newupdate = {
      ...req.body,
    };
    const _group = await group.update(newupdate, { id: req.params.id });
    if (_group.errors) {
      return Helpers.dbError(res, _group);
    }
    return Helpers.sendResponse(res, 200, 'Group updated successfully', { group: _group.rows[0] });
  }

  static async leaveGroup(req, res) {
    const data = { leave_date: date };
    const where = { id: req.params.id };
    const _group = await joinedG.update(data, where);
    if (_group.errors) {
      return Helpers.dbError(res, _group);
    }
    return Helpers.sendResponse(res, 200, 'Group left successfully');
  }

  static async groupById(req, res) {
    const _group = await group.getById(req.params.id);
    if (_group.errors) {
      return Helpers.dbError(res, _group);
    }
    return Helpers.sendResponse(res, 200, 'success', { groups: _group.row });
  }

  static async getGroupRequests(req, res) {
    const currentuser = await Helpers.getLoggedInUser(req, res);
    const _group = await group.getById(req.params.id);

    if (_group.errors) {
      return Helpers.dbError(res, _group);
    }

    if (currentuser.id === _group.row.owner_id) {
      const _requests = await joinedG.allWhere({ group_id: req.params.id, status: 'pending' });
      if (_requests.errors) {
        return Helpers.dbError(res, _requests);
      }
      return Helpers.sendResponse(res, 200, 'success', { requests: _requests.rows });
    }

    return Helpers.sendResponse(res, 400, 'You are not a group admin');
  }

  static async updateGroupRequest(req, res) {
    const currentuser = await Helpers.getLoggedInUser(req, res);
    const _jgroup = await joinedG.getById(req.params.id);

    if (_jgroup.errors) {
      return Helpers.dbError(res, _jgroup);
    }

    const _group = await group.getById(_jgroup.row.group_id);

    if (_group.errors) {
      return Helpers.dbError(res, _group);
    }

    if (currentuser.id === _group.row.owner_id) {
      const _requests = await joinedG.update({ status: req.body.status }, { id: req.params.id });
      if (_requests.errors) {
        return Helpers.dbError(res, _requests);
      }
      return Helpers.sendResponse(res, 200, 'success', { requests: _requests.rows });
    }

    return Helpers.sendResponse(res, 401, 'You are not a group admin');
  }

  static async deleteGroupRequest(req, res) {
    const currentuser = await Helpers.getLoggedInUser(req, res);
    const _jgroup = await joinedG.getById(req.params.id);

    if (_jgroup.errors) {
      return Helpers.dbError(res, _jgroup);
    }

    if (currentuser.id === _jgroup.row.user_id) {
      const _requests = await joinedG.delete({ id: req.params.id });
      if (_requests.errors) {
        return Helpers.dbError(res, _requests);
      }
      return Helpers.sendResponse(res, 200, 'successfully deleted request');
    }

    return Helpers.sendResponse(res, 401, 'You should not be here!');
  }
}

export default GroupController;
