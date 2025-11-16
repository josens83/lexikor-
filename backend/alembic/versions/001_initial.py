"""Initial migration - create all tables

Revision ID: 001_initial
Revises:
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create organizations table
    op.create_table('organizations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('address', sa.Text(), nullable=True),
        sa.Column('website', sa.String(), nullable=True),
        sa.Column('business_number', sa.String(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('max_users', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_organizations_email'), 'organizations', ['email'], unique=True)
    op.create_index(op.f('ix_organizations_business_number'), 'organizations', ['business_number'], unique=True)

    # Create subscriptions table
    op.create_table('subscriptions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('plan', sa.Enum('FREE', 'PROFESSIONAL', 'ENTERPRISE', name='subscriptionplan'), nullable=True),
        sa.Column('status', sa.Enum('ACTIVE', 'INACTIVE', 'CANCELLED', 'EXPIRED', 'TRIAL', name='subscriptionstatus'), nullable=True),
        sa.Column('query_limit', sa.Integer(), nullable=True),
        sa.Column('queries_used', sa.Integer(), nullable=True),
        sa.Column('document_limit', sa.Integer(), nullable=True),
        sa.Column('documents_count', sa.Integer(), nullable=True),
        sa.Column('price', sa.Numeric(10, 2), nullable=True),
        sa.Column('currency', sa.String(), nullable=True),
        sa.Column('billing_cycle', sa.String(), nullable=True),
        sa.Column('stripe_subscription_id', sa.String(), nullable=True),
        sa.Column('stripe_customer_id', sa.String(), nullable=True),
        sa.Column('toss_customer_id', sa.String(), nullable=True),
        sa.Column('trial_ends_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('current_period_start', sa.DateTime(timezone=True), nullable=True),
        sa.Column('current_period_end', sa.DateTime(timezone=True), nullable=True),
        sa.Column('cancelled_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_subscriptions_stripe_subscription_id'), 'subscriptions', ['stripe_subscription_id'], unique=True)

    # Create users table
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=True),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('role', sa.Enum('USER', 'LAWYER', 'ADMIN', 'ENTERPRISE', name='userrole'), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('is_verified', sa.Boolean(), nullable=True),
        sa.Column('is_superuser', sa.Boolean(), nullable=True),
        sa.Column('organization_id', sa.Integer(), nullable=True),
        sa.Column('subscription_id', sa.Integer(), nullable=True),
        sa.Column('mfa_enabled', sa.Boolean(), nullable=True),
        sa.Column('mfa_secret', sa.String(), nullable=True),
        sa.Column('google_id', sa.String(), nullable=True),
        sa.Column('microsoft_id', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_login', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ),
        sa.ForeignKeyConstraint(['subscription_id'], ['subscriptions.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_google_id'), 'users', ['google_id'], unique=True)
    op.create_index(op.f('ix_users_microsoft_id'), 'users', ['microsoft_id'], unique=True)

    # Create documents table
    op.create_table('documents',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('document_type', sa.Enum('CONTRACT', 'LAWSUIT', 'OPINION', 'NOTICE', 'COURT_DECISION', 'STATUTE', 'OTHER', name='documenttype'), nullable=True),
        sa.Column('filename', sa.String(), nullable=False),
        sa.Column('file_path', sa.String(), nullable=False),
        sa.Column('file_size', sa.Integer(), nullable=True),
        sa.Column('file_extension', sa.String(), nullable=True),
        sa.Column('mime_type', sa.String(), nullable=True),
        sa.Column('status', sa.Enum('UPLOADING', 'PROCESSING', 'COMPLETED', 'FAILED', name='documentstatus'), nullable=True),
        sa.Column('extracted_text', sa.Text(), nullable=True),
        sa.Column('summary', sa.Text(), nullable=True),
        sa.Column('analysis_results', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('risk_score', sa.Integer(), nullable=True),
        sa.Column('key_clauses', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('metadata', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('tags', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('s3_key', sa.String(), nullable=True),
        sa.Column('s3_bucket', sa.String(), nullable=True),
        sa.Column('is_public', sa.Boolean(), nullable=True),
        sa.Column('shared_with', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('owner_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('processed_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create conversations table
    op.create_table('conversations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('summary', sa.Text(), nullable=True),
        sa.Column('legal_area', sa.String(), nullable=True),
        sa.Column('metadata', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('model_name', sa.String(), nullable=True),
        sa.Column('temperature', sa.String(), nullable=True),
        sa.Column('max_tokens', sa.Integer(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('is_archived', sa.Boolean(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_message_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create messages table
    op.create_table('messages',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('role', sa.Enum('USER', 'ASSISTANT', 'SYSTEM', name='messagerole'), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('tokens_used', sa.Integer(), nullable=True),
        sa.Column('model_used', sa.String(), nullable=True),
        sa.Column('citations', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('sources', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('rating', sa.Integer(), nullable=True),
        sa.Column('feedback', sa.Text(), nullable=True),
        sa.Column('conversation_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['conversation_id'], ['conversations.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create legal_cases table
    op.create_table('legal_cases',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('case_number', sa.String(), nullable=True),
        sa.Column('case_name', sa.String(), nullable=False),
        sa.Column('court', sa.String(), nullable=True),
        sa.Column('summary', sa.Text(), nullable=True),
        sa.Column('full_text', sa.Text(), nullable=True),
        sa.Column('judgment', sa.Text(), nullable=True),
        sa.Column('reasoning', sa.Text(), nullable=True),
        sa.Column('case_type', sa.String(), nullable=True),
        sa.Column('legal_area', sa.String(), nullable=True),
        sa.Column('keywords', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('decision_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('filing_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('plaintiff', sa.String(), nullable=True),
        sa.Column('defendant', sa.String(), nullable=True),
        sa.Column('cited_statutes', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('cited_cases', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('source_url', sa.String(), nullable=True),
        sa.Column('pdf_url', sa.String(), nullable=True),
        sa.Column('is_precedent', sa.Boolean(), nullable=True),
        sa.Column('precedent_level', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_legal_cases_case_number'), 'legal_cases', ['case_number'], unique=True)

    # Create statutes table
    op.create_table('statutes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('statute_name', sa.String(), nullable=False),
        sa.Column('statute_number', sa.String(), nullable=True),
        sa.Column('full_text', sa.Text(), nullable=False),
        sa.Column('summary', sa.Text(), nullable=True),
        sa.Column('articles', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('statute_type', sa.String(), nullable=True),
        sa.Column('category', sa.String(), nullable=True),
        sa.Column('keywords', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('enacted_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('effective_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_amended_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('is_repealed', sa.Boolean(), nullable=True),
        sa.Column('source_url', sa.String(), nullable=True),
        sa.Column('related_statutes', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('amendments', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_statutes_statute_name'), 'statutes', ['statute_name'], unique=False)
    op.create_index(op.f('ix_statutes_statute_number'), 'statutes', ['statute_number'], unique=True)


def downgrade() -> None:
    op.drop_table('statutes')
    op.drop_table('legal_cases')
    op.drop_table('messages')
    op.drop_table('conversations')
    op.drop_table('documents')
    op.drop_table('users')
    op.drop_table('subscriptions')
    op.drop_table('organizations')
