import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'advertisement',
    title: 'Advertisement',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Campaign Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'clientName',
            title: 'Client Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'revenue',
            title: 'Revenue',
            type: 'number',
            initialValue: 0,
        }),
        defineField({
            name: 'startDate',
            title: 'Start Date',
            type: 'datetime',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'endDate',
            title: 'End Date',
            type: 'datetime',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'autoRenewal',
            title: 'Auto Renewal',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Active', value: 'active' },
                    { title: 'Scheduled', value: 'scheduled' },
                    { title: 'Expired', value: 'expired' },
                    { title: 'Canceled', value: 'canceled' },
                ],
            },
            initialValue: 'scheduled',
        }),
        defineField({
            name: 'image',
            title: 'Ad Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'destinationUrl',
            title: 'Destination URL',
            type: 'url',
            description: 'Where the ad leads to when clicked.',
        }),
        defineField({
            name: 'placement',
            title: 'Placement',
            type: 'string',
            description: 'Where this ad should appear on the site.',
            options: {
                list: [
                    { title: 'Homepage Leaderboard (728x90)', value: 'homepage_leaderboard' },
                    { title: 'Homepage Sidebar (300x600)', value: 'homepage_sidebar' },
                    { title: 'Article Footer (728x90)', value: 'article_footer' },
                ],
            },
        }),
        defineField({
            name: 'disclosureText',
            title: 'Disclosure Text',
            type: 'string',
            description: 'e.g. "Sponsored by [Client Name]"',
            initialValue: 'Sponsored',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'clientName',
            media: 'image',
            status: 'status',
        },
        prepare(selection) {
            const { title, subtitle, status, media } = selection
            return {
                title: title,
                subtitle: `${subtitle} (${status})`,
                media: media,
            }
        },
    },
})
