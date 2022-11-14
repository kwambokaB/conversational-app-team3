import { createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import courseService, { GetAllType } from '../apiServices/courseService';
import { CourseItem, EnrolledCourseResponseType, EnrolledCourseType } from '../interfaces/Course';

type InitialStateType = {
  enrolled:EnrolledCourseType[],
  courses:CourseItem[]
};

type ReducerState = {
  courses: InitialStateType
};

const courseReducer = createSlice({
  name: 'courses',
  initialState: {
    enrolled: [],
    courses: [],
  },
  reducers: { },
  extraReducers(builder) {
    builder
      .addMatcher(
        courseService.endpoints.getAllCourse.matchFulfilled,
        (state: InitialStateType, { payload }: { payload: GetAllType }) => {
          const currenState = state;
          currenState.courses = payload.data.courses;
        },
      ).addMatcher(
        courseService.endpoints.getEnrolledCourses.matchFulfilled,
        (state: InitialStateType, { payload }: { payload: EnrolledCourseResponseType }) => {
          const currenState = state;
          currenState.enrolled = payload.data.courses;
        },
      );
  },
});

export const useCourses = () => useSelector((state:ReducerState) => state.courses.courses);
export const useEnrolledCourses = () => useSelector((state:ReducerState) => state.courses.enrolled);

export default courseReducer;