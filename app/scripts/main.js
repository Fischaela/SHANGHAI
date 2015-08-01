/* global $ */
( function () {
    'use strict';
    var weddingDate = new Date( 2015, 6, 24, 11, 30 ),
        MINUTE_IN_MS = 1000 * 60,
        HOUR_IN_MS = MINUTE_IN_MS * 60,
        DAY_IN_MS = HOUR_IN_MS * 24,
        YEAR_IN_MS = DAY_IN_MS * 365,
        counterContainer = $( '#counter' ),
        iconContainer = $( '#icon' ),
        counterElements = [
            {
                digitElement : $( '#yearDigit' ),
                labelElement : $( '#yearLabel' ),
                calc : function ( diff ) {
                    return Math.floor( diff / YEAR_IN_MS );
                },
                singular : 'Jahr',
                plural : 'Jahre'
            },
            {
                digitElement : $( '#dayDigit' ),
                labelElement : $( '#dayLabel' ),
                calc : function ( diff ) {
                    return Math.floor( ( diff % YEAR_IN_MS ) / DAY_IN_MS );
                },
                singular : 'Tag',
                plural : 'Tage'
            },
            {
                digitElement : $( '#hourDigit' ),
                labelElement : $( '#hourLabel' ),
                calc : function ( diff ) {
                    return Math.floor( ( diff % DAY_IN_MS ) / HOUR_IN_MS );
                },
                singular : 'Stunde',
                plural : 'Stunden'
            },
            {
                digitElement : $( '#minuteDigit' ),
                labelElement : $( '#minuteLabel' ),
                calc : function ( diff ) {
                    return Math.floor( ( diff % HOUR_IN_MS ) / MINUTE_IN_MS );
                },
                singular : 'Minute',
                plural : 'Minuten'
            },
            {
                digitElement : $( '#secondDigit' ),
                labelElement : $( '#secondLabel' ),
                calc : function ( diff ) {
                    return Math.floor( ( diff % MINUTE_IN_MS ) / 1000 );
                },
                singular : 'Sekunde',
                plural : 'Sekunden'
            }
        ],
        SECOND = 1000;

    function updateScope ( diff ) {
        $.each( counterElements, function ( index, value ) {
            var digit = value.calc( diff );
            value.digitElement.text( digit );

            if ( digit === 1 ) {
                value.labelElement.text( value.singular );
            } else {
                value.labelElement.text( value.plural );
            }
        } );
    }

    function countUp ( dateToday ) {
        var today = dateToday,
            diff = Math.round( today - weddingDate );
        updateScope( diff );
        today.setSeconds( today.getSeconds() + 1 );

        setTimeout( function () {
            countUp( today );
        }, SECOND );
    }

    ( function () {
        var apiUrl = 'http://api.timezonedb.com/?zone=Europe/Berlin&format=json&key=309DGKMTBMAM';

        counterContainer.hide();

        function error () {
            countUp( new Date() );
            counterContainer.fadeIn( 1000 );
            iconContainer.removeClass( 'loading' );
        }

        function success ( data ) {
            var now = new Date ( data.timestamp * 1000 );
            countUp ( now );
            counterContainer.fadeIn( 1000 );
            iconContainer.removeClass( 'loading' );
        }

        $.ajax({
            url : apiUrl,
            success : success,
            error : error
        });
    } ) ();
} ) ();
