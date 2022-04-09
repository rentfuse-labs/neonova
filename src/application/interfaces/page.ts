import React from 'react';

export interface Page {
	url: string;
	title: string;
	icon: React.ReactNode;
	extra?: React.ReactNode;
}
