import { DBClient } from '@acme/db';
import { Logger } from '@acme/log';

interface UserRequest {
    ip?: string;
    headers?: Record<string, string>;
    userId: string;
}

interface AnalyticsUpdate {
    userId: string;
    platform: string;
    sessionCount: number;
    lastLogin: Date;
}

async function updateUserAnalytics(
    userId: string,
    platform: string,
    database: DBClient,
    request: UserRequest,
    logger: Logger
): Promise<AnalyticsUpdate> {

    logger.debug('Updating user analytics', { userId, platform });

    // Use parameterized queries to prevent SQL injection
    const updateQuery = `
		UPDATE users 
		SET 
			last_login = NOW(),
			login_count = login_count + 1,
			updated_at = NOW()
		WHERE id = ? AND status = 'active'
	`;

    const logQuery = `
		INSERT INTO user_activity_log (user_id, action, platform, ip_address, created_at)
		VALUES (?, 'login', ?, ?, NOW())
	`;

    try {
        // Update user record
        await database.query(updateQuery, [userId]);

        // Log the activity
        await database.query(logQuery, [
            userId,
            platform,
            request.ip || 'unknown'
        ]);

        // Get updated session count
        const result = await database.query(
            'SELECT login_count FROM users WHERE id = ?',
            [userId]
        );

        const sessionCount = result[0]?.login_count || 0;

        logger.info('User analytics updated successfully', {
            userId,
            platform,
            sessionCount
        });

        return {
            userId,
            platform,
            sessionCount,
            lastLogin: new Date()
        };

    } catch (error) {
        logger.error('Failed to update user analytics', {
            userId,
            platform,
            error: (error as Error).message
        });
        throw new Error('Analytics update failed');
    }
}

async function cleanupOldSessions(database: DBClient, logger: Logger): Promise<void> {
    const cleanupQuery = `
		DELETE FROM user_sessions 
		WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
	`;

    try {
        const result = await database.query(cleanupQuery);
        logger.info(`Cleaned up old sessions`, { deletedCount: result.affectedRows });
    } catch (error) {
        logger.error('Session cleanup failed', { error: (error as Error).message });
    }
}

export { updateUserAnalytics, cleanupOldSessions };