import React, { Component, memo, useState } from 'react'
import { ScrollView, TouchableOpacity, View, Text, Image, FlatList, Dimensions } from 'react-native'
import { useRef } from 'react';
import { useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { checkNamNhuan } from '../Services/Helper/common';
import { current } from '@reduxjs/toolkit';
let days = [''], months = [''], years = [''];
const today = new Date();
const month31 = [1, 3, 5, 7, 8, 10, 12];
for (let i = 1; i <= 31; i++) {
	days.push(`${('0' + i).slice(-2)}`);
}
days.push('');
for (let i = 1; i <= 12; i++) {
	months.push(`thg ${i}`);
}
months.push('');
for (let i = 1900; i <= today.getFullYear(); i++) {
	years.push(`${i}`);
}
years.push('');

//trungtt123
function MyDatePicker(props) {
	const day = useRef();
	const month = useRef();
	const year = useRef();
	const scrollDayRef = useRef();
	const scrollMonthRef = useRef();
	const scrollYearRef = useRef();
	const handleOnChange = () => {
		if (!month31.includes(month.current) && day.current === 31){
			day.current = 30;
			scrollDayRef.current?.scrollTo({
				y: 29 * 50,
			});
		}
		if (checkNamNhuan(year.current) && month.current === 2 && day.current >= 29){
			day.current = 29;
			scrollDayRef.current?.scrollTo({
				y: 28 * 50,
			});
		}
		if (!checkNamNhuan(year.current) && month.current === 2 && day.current >= 28){
			day.current = 28;
			scrollDayRef.current?.scrollTo({
				y: 27 * 50,
			});
		}
		let dateDate = new Date();
		dateDate.setDate(day.current);
		dateDate.setMonth(month.current - 1);
		dateDate.setFullYear(year.current);
		if (props?.onChange) props?.onChange(dateDate);
	}
	const handleScrollDay = useCallback((nativeEvent) => {
		const offset = Math.round(nativeEvent.contentOffset.y / 50);
		day.current = offset + 1;
		scrollDayRef.current?.scrollTo({
			y: offset * 50,
		});
		handleOnChange();
	}, [])
	const handleScrollMonth = useCallback((nativeEvent) => {
		const offset = Math.round(nativeEvent.contentOffset.y / 50);
		scrollMonthRef.current?.scrollTo({
			y: offset * 50,
		});
		month.current = offset + 1;
		handleOnChange();
	}, [])
	const handleScrollYear = useCallback((nativeEvent) => {
		const offset = Math.round(nativeEvent.contentOffset.y / 50);
		scrollYearRef.current?.scrollTo({
			y: offset * 50,
		});
		year.current = offset + 1900;
		handleOnChange();
	}, []);
	useEffect(() => {
		day.current = today.getDate();
		month.current = today.getMonth() + 1;
		year.current = today.getFullYear();
		scrollDayRef.current?.scrollTo({
			y: (today.getDate() - 1) * 50,
			animated: false
		});
		scrollMonthRef.current?.scrollTo({
			y: (today.getMonth()) * 50,
			animated: false
		});
		scrollYearRef.current?.scrollTo({
			y: (today.getFullYear() - 1) * 50,
			animated: false
		});
	}, [])
	return (
		<View style={{ width: '100%', height: 150, flexDirection: 'row'}}>
			<View style={{ flex: 1, marginHorizontal: 2 }}>
				<ScrollView ref={scrollDayRef}
					style={{ flex: 1 }}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					onMomentumScrollEnd={({ nativeEvent }) => handleScrollDay(nativeEvent)}
				>
					{
						days.map((item, index) => {
							return <View key={index} style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
								<Text>{item}</Text>
							</View>
						})
					}

				</ScrollView>
				<View style={{
					width: '100%', height: 2, backgroundColor: '#8c8d90',
					position: 'absolute', top: 100
				}}></View>
				<View style={{
					width: '100%', height: 2, backgroundColor: '#8c8d90',
					position: 'absolute', top: 50
				}}></View>
				<LinearGradient
					colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
					start={{
						x: 0.5,
						y: 0
					}}
					end={{
						x: 0.5,
						y: 1
					}}
					style={{
						width: '100%', height: 50,
						position: 'absolute', top: 0, zIndex: 99
					}}
				></LinearGradient>
				<LinearGradient
					colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
					start={{
						x: 0.5,
						y: 0
					}}
					end={{
						x: 0.5,
						y: 1
					}}
					style={{
						width: '100%', height: 50,
						position: 'absolute', top: 100, zIndex: 99
					}}
				></LinearGradient>
			</View>
			<View style={{ flex: 1, marginHorizontal: 2 }}>
				<ScrollView ref={scrollMonthRef}
					style={{ flex: 1 }}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					onMomentumScrollEnd={({ nativeEvent }) => handleScrollMonth(nativeEvent)}
				>
					{
						months.map((item, index) => {
							return <View key={index} style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
								<Text>{item}</Text>
							</View>
						})
					}

				</ScrollView>
				<View style={{
					width: '100%', height: 2, backgroundColor: '#8c8d90',
					position: 'absolute', top: 100
				}}></View>
				<View style={{
					width: '100%', height: 2, backgroundColor: '#8c8d90',
					position: 'absolute', top: 50
				}}></View>
				<LinearGradient
					colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
					start={{
						x: 0.5,
						y: 0
					}}
					end={{
						x: 0.5,
						y: 1
					}}
					style={{
						width: '100%', height: 50,
						position: 'absolute', top: 0, zIndex: 99
					}}
				></LinearGradient>
				<LinearGradient
					colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
					start={{
						x: 0.5,
						y: 0
					}}
					end={{
						x: 0.5,
						y: 1
					}}
					style={{
						width: '100%', height: 50,
						position: 'absolute', top: 100, zIndex: 99
					}}
				></LinearGradient>
			</View>
			<View style={{ flex: 1, marginHorizontal: 2 }}>
				<ScrollView ref={scrollYearRef}
					style={{ flex: 1 }}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					onMomentumScrollEnd={({ nativeEvent }) => handleScrollYear(nativeEvent)}
				>
					{
						years.map((item, index) => {
							return <View key={index} style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
								<Text>{item}</Text>
							</View>
						})
					}

				</ScrollView>
				<View style={{
					width: '100%', height: 2, backgroundColor: '#8c8d90',
					position: 'absolute', top: 100,
				}}></View>
				<View style={{
					width: '100%', height: 2, backgroundColor: '#8c8d90',
					position: 'absolute', top: 50,
				}}></View>
				<LinearGradient
					colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
					start={{
						x: 0.5,
						y: 0
					}}
					end={{
						x: 0.5,
						y: 1
					}}
					style={{
						width: '100%', height: 50,
						position: 'absolute', top: 0, zIndex: 99
					}}
				></LinearGradient>
				<LinearGradient
					colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
					start={{
						x: 0.5,
						y: 0
					}}
					end={{
						x: 0.5,
						y: 1
					}}
					style={{
						width: '100%', height: 50,
						position: 'absolute', top: 100, zIndex: 99
					}}
				></LinearGradient>
			</View>
		</View>
	)
}
export default memo(MyDatePicker)